import { useMemo, useState } from 'react';
import type { Entsorger, Sendung } from '../types';
import { berechneGesamtanzahl, berechneGesamtgewicht, validiereSendung } from '../adr';
import { downloadPdf, generateAlleDokumente } from '../pdf';
import { ENTSORGER_STANDARD, findEntsorger } from '../data/entsorger';

interface Props {
  sendung: Sendung;
  customEntsorger: Entsorger[];
  onClose: () => void;
  onUpdate: (patch: Partial<Sendung>) => void;
  onVersendet: () => void;
}

export function VersandDialog({ sendung, customEntsorger, onClose, onUpdate, onVersendet }: Props) {
  const [entsorgerId, setEntsorgerId] = useState(sendung.entsorgerId || 'landbell');
  const [referenz, setReferenz] = useState(sendung.referenz ?? '');
  const [kundenNr, setKundenNr] = useState(sendung.absender.kundenNr ?? '');
  const [wunschdatum, setWunschdatum] = useState(sendung.abholungWunschdatum ?? '');
  const [absenderFirma, setAbsenderFirma] = useState(sendung.absender.firma);
  const [absStrasse, setAbsStrasse] = useState(sendung.absender.adresse.strasse);
  const [absPlz, setAbsPlz] = useState(sendung.absender.adresse.plz);
  const [absOrt, setAbsOrt] = useState(sendung.absender.adresse.ort);
  const [absTelefon, setAbsTelefon] = useState(sendung.absender.telefon);
  const [absEmail, setAbsEmail] = useState(sendung.absender.email);

  const alleEntsorger = [...ENTSORGER_STANDARD, ...customEntsorger];
  const entsorger = findEntsorger(entsorgerId, customEntsorger);

  const merged: Sendung = useMemo(() => ({
    ...sendung,
    entsorgerId,
    referenz,
    abholungWunschdatum: wunschdatum || undefined,
    absender: {
      ...sendung.absender,
      firma: absenderFirma,
      adresse: { ...sendung.absender.adresse, strasse: absStrasse, plz: absPlz, ort: absOrt },
      telefon: absTelefon,
      email: absEmail,
      kundenNr,
    },
  }), [sendung, entsorgerId, referenz, wunschdatum, absenderFirma, absStrasse, absPlz, absOrt, absTelefon, absEmail, kundenNr]);

  const val = validiereSendung(merged);

  function speichern() {
    onUpdate({
      entsorgerId,
      referenz,
      abholungWunschdatum: wunschdatum || undefined,
      absender: merged.absender,
    });
  }

  function pdfsErzeugen() {
    if (!entsorger) return alert('Bitte Entsorger auswählen.');
    speichern();
    const pdfs = generateAlleDokumente(merged, entsorger);
    const base = `sendung-${sendung.id}`;
    downloadPdf(pdfs.inventar, `${base}-inventar.pdf`);
    downloadPdf(pdfs.bef, `${base}-befoerderungspapier.pdf`);
    downloadPdf(pdfs.pack, `${base}-packliste.pdf`);
  }

  function mailOeffnen() {
    if (!entsorger) return alert('Bitte Entsorger auswählen.');
    speichern();
    const to = entsorger.email || '';
    const subject = `Abholanfrage Altbatterien · Sendung ${sendung.id}`;
    const body = [
      `Guten Tag${entsorger.ansprechpartner ? ' ' + entsorger.ansprechpartner : ''},`,
      '',
      'anbei bitte ich um Terminierung der Abholung folgender Sendung:',
      '',
      `Referenz:            ${referenz || '(keine)'}`,
      `Kundennummer:        ${kundenNr || '(keine)'}`,
      `Wunschdatum:         ${wunschdatum || '(nach Absprache)'}`,
      `Anzahl Akkus:        ${berechneGesamtanzahl(sendung.akkus)}`,
      `Positionen:          ${sendung.akkus.length}`,
      `Nettogewicht gesamt: ${berechneGesamtgewicht(sendung.akkus).toFixed(2)} kg`,
      '',
      'Beigefügt (bitte lokal anhängen):',
      ' – Inventarliste',
      ' – ADR-Beförderungspapier',
      ' – Packliste / Verpackungs-Checkliste',
      '',
      'Bitte um Bestätigung des Abholtermins.',
      '',
      'Freundliche Grüße',
      absenderFirma,
    ].join('\n');
    const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  function versendetMarkieren() {
    speichern();
    onVersendet();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white sm:rounded-2xl">
        <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-white px-4 py-3">
          <button onClick={onClose} className="rounded p-2 hover:bg-gray-100">
            <svg className="h-5 w-5"><use href="./icons.svg#i-chevron-left"/></svg>
          </button>
          <h2 className="text-lg font-bold">Versand vorbereiten</h2>
        </header>

        <div className="space-y-4 p-4">
          {val.fehler.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
              <div className="mb-1 font-semibold">Bitte prüfen:</div>
              <ul className="list-disc pl-4">{val.fehler.map((f, i) => <li key={i}>{f}</li>)}</ul>
            </div>
          )}
          {val.warnungen.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <div className="mb-1 font-semibold">Hinweise:</div>
              <ul className="list-disc pl-4">{val.warnungen.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          )}

          <section className="rounded-xl border border-gray-200 p-3">
            <label className="mb-1 block text-sm font-semibold">Entsorger</label>
            <select value={entsorgerId} onChange={(e) => setEntsorgerId(e.target.value)} className="w-full rounded-lg border p-2">
              {alleEntsorger.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            {entsorger && (
              <p className="mt-2 text-xs text-gray-600">{entsorger.hinweise}</p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <TextFeld label="Kundennummer" value={kundenNr} onChange={setKundenNr} placeholder="Landbell-Kd.-Nr." />
              <TextFeld label="Referenz / Auftragsnr." value={referenz} onChange={setReferenz} />
              <TextFeld label="Abholung Wunschdatum" value={wunschdatum} onChange={setWunschdatum} type="date" />
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 p-3">
            <div className="mb-2 text-sm font-semibold">Absender</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><TextFeld label="Firma" value={absenderFirma} onChange={setAbsenderFirma} /></div>
              <div className="col-span-2"><TextFeld label="Straße" value={absStrasse} onChange={setAbsStrasse} /></div>
              <TextFeld label="PLZ" value={absPlz} onChange={setAbsPlz} />
              <TextFeld label="Ort" value={absOrt} onChange={setAbsOrt} />
              <TextFeld label="Telefon" value={absTelefon} onChange={setAbsTelefon} />
              <TextFeld label="E-Mail" value={absEmail} onChange={setAbsEmail} type="email" />
            </div>
          </section>

          <div className="grid gap-2">
            <button
              onClick={pdfsErzeugen}
              disabled={val.fehler.length > 0}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white disabled:bg-gray-300"
            >
              <svg className="h-5 w-5"><use href="./icons.svg#i-download"/></svg>
              PDFs herunterladen
            </button>
            <button
              onClick={mailOeffnen}
              disabled={val.fehler.length > 0}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white disabled:bg-gray-300"
            >
              <svg className="h-5 w-5"><use href="./icons.svg#i-mail"/></svg>
              E-Mail an Entsorger öffnen
            </button>
            <button
              onClick={versendetMarkieren}
              disabled={val.fehler.length > 0}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-800 py-3 font-medium text-white disabled:bg-gray-300"
            >
              <svg className="h-5 w-5"><use href="./icons.svg#i-check"/></svg>
              Als versendet markieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextFeld({
  label, value, onChange, type = 'text', placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 p-2 text-sm"
      />
    </div>
  );
}
