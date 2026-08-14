import type {
  AdrKlassifizierung,
  AdrSv,
  AdrUnNummer,
  AdrVerpackung,
  Akku,
  AkkuChemie,
  AkkuZustand,
  Sendung,
} from './types';

// Referenz: ADR 2025 Kapitel 3.2 (Gefahrgutverzeichnis), 3.3 (Sondervorschriften
// 188, 376, 377), 4.1.4.1 (Verpackungsanweisungen P903, P909, P911, LP904).

export function istLithium(chemie: AkkuChemie): boolean {
  return (
    chemie === 'lithium-ion' ||
    chemie === 'lifepo4' ||
    chemie === 'lithium-polymer' ||
    chemie === 'lithium-metall'
  );
}

function unNummerFuer(chemie: AkkuChemie, inGeraet: boolean): AdrUnNummer {
  if (chemie === 'lithium-metall') return inGeraet ? 'UN3091' : 'UN3090';
  if (chemie === 'lithium-ion' || chemie === 'lifepo4' || chemie === 'lithium-polymer') {
    return inGeraet ? 'UN3481' : 'UN3480';
  }
  if (chemie === 'blei-gel' || chemie === 'blei-saeure') return 'UN2800';
  return null;
}

function bezeichnungFuer(un: AdrUnNummer, zustand: AkkuZustand): string {
  const beschaedigt = zustand === 'defekt' || zustand === 'kritisch-defekt';
  switch (un) {
    case 'UN3480':
      return beschaedigt
        ? 'UN 3480 LITHIUM-IONEN-BATTERIEN, BESCHÄDIGT/DEFEKT, 9, (E)'
        : 'UN 3480 LITHIUM-IONEN-BATTERIEN, 9, (E)';
    case 'UN3481':
      return beschaedigt
        ? 'UN 3481 LITHIUM-IONEN-BATTERIEN IN AUSRÜSTUNGEN, BESCHÄDIGT/DEFEKT, 9, (E)'
        : 'UN 3481 LITHIUM-IONEN-BATTERIEN IN AUSRÜSTUNGEN, 9, (E)';
    case 'UN3090':
      return beschaedigt
        ? 'UN 3090 LITHIUM-METALL-BATTERIEN, BESCHÄDIGT/DEFEKT, 9, (E)'
        : 'UN 3090 LITHIUM-METALL-BATTERIEN, 9, (E)';
    case 'UN3091':
      return beschaedigt
        ? 'UN 3091 LITHIUM-METALL-BATTERIEN IN AUSRÜSTUNGEN, BESCHÄDIGT/DEFEKT, 9, (E)'
        : 'UN 3091 LITHIUM-METALL-BATTERIEN IN AUSRÜSTUNGEN, 9, (E)';
    case 'UN2800':
      return 'UN 2800 BATTERIEN, NASS, AUSLAUFSICHER, 8, III, (E)';
    default:
      return '(nicht zuordenbar — bitte manuell prüfen)';
  }
}

export function klassifiziereAkku(
  chemie: AkkuChemie,
  zustand: AkkuZustand,
  inGeraet: boolean,
): AdrKlassifizierung {
  const un = unNummerFuer(chemie, inGeraet);
  let sv: AdrSv = null;
  let verpackung: AdrVerpackung = null;
  let hinweis = '';

  if (istLithium(chemie)) {
    if (zustand === 'kritisch-defekt') {
      sv = 'SV376';
      verpackung = 'P911';
      hinweis =
        'Kritisch defekt — brand-/druckfeste Sonderverpackung nach P911 (bzw. LP906) erforderlich. Nur mit Zustimmung des Entsorgers und ADR-Beauftragten befördern.';
    } else if (zustand === 'defekt') {
      sv = 'SV376';
      verpackung = 'P909';
      hinweis =
        'Defekt — UN-zertifizierte Verpackung mit nicht-brennbarem, nicht-leitendem Füllmaterial (Vermiculit/Sand). Kein direkter Kontakt zwischen Zellen.';
    } else if (zustand === 'gebraucht') {
      sv = 'SV377';
      verpackung = 'P909-PALOXE';
      hinweis =
        'Zur Entsorgung (SV 377) — bei DS/Landbell Standard: Dolav-Paloxe. Pole abkleben, in Vermiculit einbetten (oben/unten/seitlich), einzeln mit Abstand einlegen. Keine kritisch defekten Akkus in die Paloxe!';
    } else {
      sv = 'SV188';
      verpackung = 'P903';
      hinweis =
        'Intakt — Standard-Beförderung nach P903. Bei Wh < 100 (Ion) bzw. Li-Gehalt < 2 g (Metall) ggf. SV 188 (Freistellung) möglich.';
    }
  } else if (chemie === 'blei-gel' || chemie === 'blei-saeure') {
    verpackung = 'P801' as AdrVerpackung;
    hinweis =
      'Blei-Batterie (UN 2800) — auslaufsichere Verpackung, aufrechte Stellung, Pole abgedeckt. Blei-Säure zusätzlich: säurefeste Auffangwanne.';
  } else if (chemie === 'nimh' || chemie === 'nicd' || chemie === 'alkaline' || chemie === 'zink-kohle') {
    hinweis =
      'Nicht ADR-relevant (kein Gefahrgut) — trotzdem für Sammelbeförderung Pole gegen Kurzschluss isolieren.';
  } else {
    hinweis = 'Chemie unbekannt — bitte manuell klassifizieren.';
  }

  return {
    unNummer: un,
    bezeichnung: bezeichnungFuer(un, zustand),
    klasse: un === 'UN2800' ? '8' : un ? '9' : null,
    sv,
    verpackung: verpackung as AdrVerpackung,
    hinweis,
  };
}

export function getVerpackungsAnweisung(vp: AdrVerpackung): {
  code: string;
  titel: string;
  punkte: string[];
} | null {
  if (!vp) return null;
  switch (vp) {
    case 'P801':
      return {
        code: 'P801',
        titel: 'Verpackungsanweisung P801 (Blei-Batterien, UN 2800)',
        punkte: [
          'Auslaufsichere Verpackung, Batterien aufrecht.',
          'Pole gegen Kurzschluss isoliert.',
          'Blei-Säure zusätzlich: säurefeste Auffangwanne.',
          'Kennzeichnung Klasse 8, UN 2800.',
        ],
      };
    case 'P903':
      return {
        code: 'P903',
        titel: 'Verpackungsanweisung P903 (intakte Lithium-Batterien)',
        punkte: [
          'UN-zertifizierte Außenverpackung (Fass, Kiste, Karton mit UN-Kennzeichnung).',
          'Innenverpackung: jeder Akku einzeln oder polbezogen isoliert.',
          'Bruttomasse ≤ 30 kg für Karton (4G), sonst höher zulässig je nach Bauart.',
          'Gefahrzettel Klasse 9A, UN-Nummer, Handhabungspfeile.',
        ],
      };
    case 'P909':
      return {
        code: 'P909',
        titel: 'Verpackungsanweisung P909 (defekte/gebrauchte Lithium-Batterien)',
        punkte: [
          'UN-zertifizierte Außenverpackung, stoß- und druckfest.',
          'Jede Zelle einzeln in nicht-leitendem, nicht-brennbarem Füllmaterial (Vermiculit, Perlite, trockener Sand) eingebettet.',
          'Innenverpackung so, dass Zellen sich nicht berühren und nicht verrutschen können.',
          'Kennzeichnung mit "BESCHÄDIGTE/DEFEKTE LITHIUM-IONEN-BATTERIEN" bzw. entsprechend UN-Nummer.',
          'Kein direkter Kontakt zwischen Polen.',
        ],
      };
    case 'P909-PALOXE':
      return {
        code: 'P909 (Dolav-Paloxe)',
        titel: 'P909 in Dolav-Paloxe (DS/Landbell-Standard für SV 377)',
        punkte: [
          'Dolav-Paloxe: extra angefertigte Sammelbox mit Kunststoff-Verkleidung und Metall-Grundgerüst.',
          'Vorher alle Pole mit Isolierband abkleben.',
          'Akkus einzeln mit Abstand einlegen — Pole dürfen sich nicht berühren.',
          'Nicht direkt auf den Boden legen — komplett in Vermiculit einbetten (oben/unten/links/rechts).',
          'Zwischenräume ebenfalls mit Vermiculit verfüllen; mehrere Schichten übereinander zulässig.',
          'KEINE transportkritischen Akkus (ADR SV 376): keine Ausgasung, nicht aufgebläht, nicht deformiert, nicht äußerlich beschädigt — im Zweifel Beurteilung durch Sachverständigen.',
          'Kennzeichnungslabel "Lithiumbatterien zum Recycling" (UN 3090 / UN 3480, Klasse 9) außen anbringen.',
        ],
      };
    case 'P911':
      return {
        code: 'P911',
        titel: 'Verpackungsanweisung P911 (kritisch defekte Lithium-Batterien)',
        punkte: [
          'Spezielle UN-zertifizierte brand- und druckfeste Sonderverpackung (z. B. zertifizierter Stahlbehälter mit Sicherheitsventil).',
          'Jeder Akku einzeln in nicht-brennbarem Füllmaterial isoliert.',
          'Freisetzung von brennbaren Gasen muss kontrolliert entweichen können (Druckentlastung).',
          'Nur mit Zustimmung des zuständigen Beauftragten und Vorabinformation an Entsorger/Beförderer.',
          'Kennzeichnung wie P909, zusätzlich Hinweis auf kritischen Zustand.',
        ],
      };
    case 'LP904':
      return {
        code: 'LP904',
        titel: 'Großverpackungsanweisung LP904 (mehrere defekte Lithium-Batterien)',
        punkte: [
          'UN-zertifizierte Großverpackung (IBC / Fasspalette).',
          'Innenauskleidung nicht-brennbar, nicht-leitend, säure-/elektrolytbeständig.',
          'Individuelle Isolation jeder Zelle.',
          'Höchstzulässige Bruttomasse nach Bauart-Zulassung beachten.',
        ],
      };
    default:
      return null;
  }
}

export function getKennzeichnung(k: AdrKlassifizierung): string[] {
  const marks: string[] = [];
  if (k.klasse === '9') marks.push('Gefahrzettel 9A (Lithium-Batterien)');
  if (k.klasse === '8') marks.push('Gefahrzettel 8 (Ätzende Stoffe)');
  if (k.unNummer) marks.push(`UN-Nummer aufgedruckt: ${k.unNummer.replace('UN', 'UN ')}`);
  if (k.sv === 'SV376') marks.push('Kennzeichnung "BESCHÄDIGT/DEFEKT"');
  if (k.sv === 'SV377') marks.push('Kennzeichnung "ZUR ENTSORGUNG"');
  marks.push('Handhabungspfeile (Richtungspfeile)');
  return marks;
}

export interface Validierung {
  fehler: string[];
  warnungen: string[];
}

export function validiereSendung(sendung: Sendung): Validierung {
  const fehler: string[] = [];
  const warnungen: string[] = [];

  if (sendung.akkus.length === 0) fehler.push('Sendung enthält keine Akkus.');
  if (!sendung.absender.firma) fehler.push('Absender-Firma fehlt.');
  if (!sendung.absender.adresse.plz || !sendung.absender.adresse.ort)
    fehler.push('Absender-Adresse unvollständig.');
  if (!sendung.entsorgerId && !sendung.entsorgerOverride)
    fehler.push('Kein Entsorger ausgewählt.');

  const hatKritisch = sendung.akkus.some((a) => a.zustand === 'kritisch-defekt');
  if (hatKritisch) {
    warnungen.push(
      'Sendung enthält kritisch defekte Akkus → P911-Sonderverpackung erforderlich, Voranmeldung beim Entsorger nötig.',
    );
  }

  const gewicht = sendung.akkus.reduce((s, a) => s + a.gewichtKg * a.anzahl, 0);
  if (gewicht > 333) {
    warnungen.push(
      `Gesamtnettomasse ${gewicht.toFixed(1)} kg — Prüfen, ob 1000-Punkte-Regel überschritten wird.`,
    );
  }

  return { fehler, warnungen };
}

export function berechneGesamtgewicht(akkus: Akku[]): number {
  return akkus.reduce((s, a) => s + a.gewichtKg * a.anzahl, 0);
}

export function berechneGesamtanzahl(akkus: Akku[]): number {
  return akkus.reduce((s, a) => s + a.anzahl, 0);
}
