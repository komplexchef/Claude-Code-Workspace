import { jsPDF } from 'jspdf';
import type { Entsorger, Sendung } from './types';
import { CHEMIE_LABEL, ZUSTAND_LABEL } from './types';
import { berechneGesamtanzahl, berechneGesamtgewicht, getKennzeichnung, getVerpackungsAnweisung } from './adr';

const MARGIN = 15;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - 2 * MARGIN;

function header(doc: jsPDF, titel: string, sendung: Sendung) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(titel, MARGIN, MARGIN);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    `Sendung ${sendung.id}  ·  erstellt ${formatDatum(sendung.erstellt)}`,
    MARGIN,
    MARGIN + 6,
  );
  doc.setLineWidth(0.3);
  doc.line(MARGIN, MARGIN + 8, PAGE_W - MARGIN, MARGIN + 8);
}

function footer(doc: jsPDF, seite: number, gesamt: number) {
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    `Erstellt mit Akku-Logistik-App · ADR-Hilfsdokument, kein Ersatz für Gefahrgutbeauftragten (ADR 1.8.3)`,
    MARGIN,
    PAGE_H - 8,
  );
  doc.text(`Seite ${seite} von ${gesamt}`, PAGE_W - MARGIN, PAGE_H - 8, { align: 'right' });
  doc.setTextColor(0);
}

function formatDatum(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE') + ' ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function adresseZeile(z: { firma?: string; adresse: { strasse: string; plz: string; ort: string; land: string } }): string[] {
  const rows: string[] = [];
  if (z.firma) rows.push(z.firma);
  rows.push(z.adresse.strasse);
  rows.push(`${z.adresse.plz} ${z.adresse.ort}`);
  if (z.adresse.land) rows.push(z.adresse.land);
  return rows.filter(Boolean);
}

export function generateInventarliste(sendung: Sendung): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  header(doc, 'Inventarliste — Altbatterien', sendung);

  let y = MARGIN + 14;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const cols = ['Pos', 'Hersteller / Modell', 'Chemie', 'Zustand', 'V', 'Wh', 'kg', 'St', 'UN'];
  const colX = [MARGIN, MARGIN + 12, MARGIN + 70, MARGIN + 100, MARGIN + 130, MARGIN + 140, MARGIN + 152, MARGIN + 164, MARGIN + 172];
  cols.forEach((c, i) => doc.text(c, colX[i], y));
  doc.setLineWidth(0.2);
  doc.line(MARGIN, y + 1.5, PAGE_W - MARGIN, y + 1.5);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  sendung.akkus.forEach((a, idx) => {
    if (y > PAGE_H - 25) {
      footer(doc, doc.getNumberOfPages(), 0);
      doc.addPage();
      header(doc, 'Inventarliste — Altbatterien (Fortsetzung)', sendung);
      y = MARGIN + 14;
    }
    doc.text(String(idx + 1), colX[0], y);
    const bez = [a.hersteller, a.modell].filter(Boolean).join(' / ') || '(ohne Bezeichnung)';
    doc.text(truncate(bez, 32), colX[1], y);
    doc.text(truncate(CHEMIE_LABEL[a.chemie], 16), colX[2], y);
    doc.text(truncate(ZUSTAND_LABEL[a.zustand], 14), colX[3], y);
    doc.text(a.spannungV != null ? a.spannungV.toFixed(1) : '—', colX[4], y);
    doc.text(a.kapazitaetWh != null ? String(a.kapazitaetWh) : '—', colX[5], y);
    doc.text(a.gewichtKg.toFixed(2), colX[6], y);
    doc.text(String(a.anzahl), colX[7], y);
    doc.text((a.adr.unNummer ?? '—').replace('UN', 'UN'), colX[8], y);
    y += 5;
  });

  y += 4;
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Gesamt: ${berechneGesamtanzahl(sendung.akkus)} Akkus · ${berechneGesamtgewicht(sendung.akkus).toFixed(2)} kg netto`,
    MARGIN,
    y,
  );

  const gesamtSeiten = doc.getNumberOfPages();
  for (let i = 1; i <= gesamtSeiten; i++) {
    doc.setPage(i);
    footer(doc, i, gesamtSeiten);
  }
  return doc.output('blob');
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

export function generateBefoerderungspapier(sendung: Sendung, entsorger: Entsorger): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  header(doc, 'Beförderungspapier nach ADR 5.4.1', sendung);

  let y = MARGIN + 14;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Absender', MARGIN, y);
  doc.text('Empfänger (Entsorger)', MARGIN + 100, y);
  doc.setFont('helvetica', 'normal');
  y += 5;
  const absZeilen = adresseZeile({ firma: sendung.absender.firma, adresse: sendung.absender.adresse });
  const empZeilen = adresseZeile({ firma: entsorger.firma || entsorger.name, adresse: entsorger.adresse });
  const maxZ = Math.max(absZeilen.length, empZeilen.length);
  for (let i = 0; i < maxZ; i++) {
    if (absZeilen[i]) doc.text(absZeilen[i], MARGIN, y);
    if (empZeilen[i]) doc.text(empZeilen[i], MARGIN + 100, y);
    y += 5;
  }
  if (sendung.absender.telefon) {
    doc.text(`Tel: ${sendung.absender.telefon}`, MARGIN, y);
  }
  if (entsorger.telefon) {
    doc.text(`Tel: ${entsorger.telefon}`, MARGIN + 100, y);
  }
  y += 8;

  if (sendung.referenz || sendung.absender.kundenNr) {
    doc.setFont('helvetica', 'bold');
    doc.text('Referenz:', MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.text(
      [sendung.absender.kundenNr && `Kd.-Nr. ${sendung.absender.kundenNr}`, sendung.referenz].filter(Boolean).join(' · '),
      MARGIN + 25,
      y,
    );
    y += 6;
  }

  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Gefahrgutangaben (aggregiert pro UN-Nummer)', MARGIN, y);
  y += 6;
  doc.setFont('helvetica', 'normal');

  const gruppen = groupByUn(sendung);
  gruppen.forEach((g) => {
    if (y > PAGE_H - 40) {
      footer(doc, doc.getNumberOfPages(), 0);
      doc.addPage();
      header(doc, 'Beförderungspapier nach ADR 5.4.1 (Fortsetzung)', sendung);
      y = MARGIN + 14;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(g.bezeichnung, MARGIN, y, { maxWidth: CONTENT_W });
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Anzahl Versandstücke: ${g.anzahl}  ·  Gesamtnettomasse: ${g.gewicht.toFixed(2)} kg`,
      MARGIN,
      y,
    );
    y += 5;
    if (g.sv) {
      doc.text(`Sondervorschrift: ${g.sv}`, MARGIN, y);
      y += 5;
    }
    if (g.verpackung) {
      doc.text(`Verpackungsanweisung: ${g.verpackung}`, MARGIN, y);
      y += 5;
    }
    y += 2;
  });

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Erklärung des Absenders', MARGIN, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const erklText =
    'Hiermit erkläre ich, dass der Inhalt dieser Sendung vollständig und genau nach den geltenden ' +
    'Vorschriften des ADR beschrieben ist, klassifiziert, verpackt, gekennzeichnet und in jeder ' +
    'Hinsicht in einem für die Beförderung geeigneten Zustand ist.';
  doc.text(erklText, MARGIN, y, { maxWidth: CONTENT_W });
  y += 18;
  doc.line(MARGIN, y, MARGIN + 70, y);
  doc.line(MARGIN + 100, y, MARGIN + 170, y);
  y += 4;
  doc.setFontSize(8);
  doc.text('Ort, Datum', MARGIN, y);
  doc.text('Unterschrift Absender', MARGIN + 100, y);
  doc.setFontSize(10);

  const gesamtSeiten = doc.getNumberOfPages();
  for (let i = 1; i <= gesamtSeiten; i++) {
    doc.setPage(i);
    footer(doc, i, gesamtSeiten);
  }
  return doc.output('blob');
}

interface UnGruppe {
  un: string;
  bezeichnung: string;
  anzahl: number;
  gewicht: number;
  sv: string | null;
  verpackung: string | null;
}

function groupByUn(sendung: Sendung): UnGruppe[] {
  const map = new Map<string, UnGruppe>();
  sendung.akkus.forEach((a) => {
    const key = (a.adr.unNummer ?? 'ohne-UN') + '|' + a.adr.bezeichnung;
    const g = map.get(key) ?? {
      un: a.adr.unNummer ?? '—',
      bezeichnung: a.adr.bezeichnung,
      anzahl: 0,
      gewicht: 0,
      sv: a.adr.sv,
      verpackung: a.adr.verpackung,
    };
    g.anzahl += a.anzahl;
    g.gewicht += a.gewichtKg * a.anzahl;
    map.set(key, g);
  });
  return Array.from(map.values());
}

export function generatePackliste(sendung: Sendung): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  header(doc, 'Packliste / Verpackungs-Checkliste', sendung);

  let y = MARGIN + 14;
  const usedVp = new Set(sendung.akkus.map((a) => a.adr.verpackung).filter(Boolean));
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Verpackungsanweisungen', MARGIN, y);
  y += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  usedVp.forEach((vp) => {
    const anw = getVerpackungsAnweisung(vp);
    if (!anw) return;
    if (y > PAGE_H - 40) {
      footer(doc, doc.getNumberOfPages(), 0);
      doc.addPage();
      header(doc, 'Packliste / Verpackungs-Checkliste (Fortsetzung)', sendung);
      y = MARGIN + 14;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${anw.code} — ${anw.titel}`, MARGIN, y, { maxWidth: CONTENT_W });
    y += 5;
    doc.setFont('helvetica', 'normal');
    anw.punkte.forEach((p) => {
      doc.text(`• ${p}`, MARGIN + 3, y, { maxWidth: CONTENT_W - 3 });
      const lines = doc.splitTextToSize(p, CONTENT_W - 3).length;
      y += 4.5 * lines;
    });
    y += 3;
  });

  y += 4;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Kennzeichnung der Versandstücke', MARGIN, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const alleKennz = new Set<string>();
  sendung.akkus.forEach((a) => getKennzeichnung(a.adr).forEach((k) => alleKennz.add(k)));
  Array.from(alleKennz).forEach((k) => {
    if (y > PAGE_H - 25) {
      footer(doc, doc.getNumberOfPages(), 0);
      doc.addPage();
      header(doc, 'Packliste (Fortsetzung)', sendung);
      y = MARGIN + 14;
    }
    doc.text(`• ${k}`, MARGIN + 3, y);
    y += 4.5;
  });

  y += 4;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Konformitätsbestätigung', MARGIN, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  ['Verpackung entspricht der Anweisung', 'Kennzeichnung angebracht', 'Beförderungspapier beigelegt', 'Fahrer/Übergabe informiert'].forEach((cb) => {
    doc.rect(MARGIN, y - 3.5, 3.5, 3.5);
    doc.text(cb, MARGIN + 6, y);
    y += 6;
  });

  y += 6;
  doc.line(MARGIN, y, MARGIN + 70, y);
  y += 4;
  doc.setFontSize(8);
  doc.text('Datum, Unterschrift Verpacker', MARGIN, y);

  const gesamtSeiten = doc.getNumberOfPages();
  for (let i = 1; i <= gesamtSeiten; i++) {
    doc.setPage(i);
    footer(doc, i, gesamtSeiten);
  }
  return doc.output('blob');
}

export interface SendungsPdfs {
  inventar: Blob;
  bef: Blob;
  pack: Blob;
}

export function generateAlleDokumente(sendung: Sendung, entsorger: Entsorger): SendungsPdfs {
  return {
    inventar: generateInventarliste(sendung),
    bef: generateBefoerderungspapier(sendung, entsorger),
    pack: generatePackliste(sendung),
  };
}

export function downloadPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
