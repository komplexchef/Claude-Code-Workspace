import type { Entsorger } from '../types';

// Vorkonfigurierte Auftragsentsorger.
// Basierend auf tatsächlicher Korrespondenz (Rechnung Q2/2023 an TU Dresden,
// Auftrag 126/2023, Kd.-Nr. 53129): Die operative Abwicklung läuft über
// die DS Entsorgungs- und Dienstleistungs-GmbH (Tochter der Landbell Group).
// Landbell GmbH selbst stellt die Rechnungen.
export const ENTSORGER_STANDARD: Entsorger[] = [
  {
    id: 'ds-entsorgung',
    name: 'DS Entsorgungs-GmbH (Landbell Group)',
    firma: 'DS Entsorgungs- und Dienstleistungs-GmbH',
    adresse: {
      strasse: 'Rheinstraße 4 L',
      plz: '55116',
      ort: 'Mainz',
      land: 'Deutschland',
    },
    email: 'batteriesammlung.de@ds-entsorgungs-gmbh.de',
    ansprechpartner: 'Sabine Ey (Sales Service Specialist Battery Recycling)',
    telefon: '+49 241 95 15 2000',
    hinweise:
      'Operative Abwicklung Batterie-Rücknahme innerhalb der Landbell Group. ' +
      'Rechnungsstellung erfolgt durch Landbell GmbH (Kd.-Nr. bei Landbell eintragen, ' +
      'Auftragsnummer im Format NNN/JJJJ, KST beachten). ' +
      'Anhang der Abholanfrage: PDFs + ggf. Sortierprotokoll.',
    formatVorlage: 'landbell',
    editable: false,
  },
  {
    id: 'landbell-rechnung',
    name: 'Landbell GmbH (Rechnungsstelle)',
    firma: 'Landbell GmbH',
    adresse: {
      strasse: 'Rheinstraße 4 L',
      plz: '55116',
      ort: 'Mainz',
      land: 'Deutschland',
    },
    email: '',
    ansprechpartner: '',
    telefon: '+49 6131 235652-0',
    hinweise:
      'Landbell GmbH ist die Rechnungsstelle innerhalb der Landbell Group. ' +
      'Operative Abholanfragen bitte an DS Entsorgungs-GmbH richten. ' +
      'HRB 7123 Mainz, USt-ID DE205246700.',
    formatVorlage: 'landbell',
    editable: false,
  },
  {
    id: 'custom',
    name: 'Eigener Entsorger',
    firma: '',
    adresse: { strasse: '', plz: '', ort: '', land: 'Deutschland' },
    email: '',
    ansprechpartner: '',
    telefon: '',
    hinweise: 'Individuelle Entsorger-Daten bei jeder Sendung eintragen.',
    formatVorlage: 'standard',
    editable: true,
  },
];

export function findEntsorger(id: string, custom: Entsorger[]): Entsorger | undefined {
  return [...ENTSORGER_STANDARD, ...custom].find((e) => e.id === id);
}
