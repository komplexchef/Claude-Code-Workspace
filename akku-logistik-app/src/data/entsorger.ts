import type { Entsorger } from '../types';

// Vorkonfigurierte Auftragsentsorger.
// TODO: Sobald das Landbell-Formular unter reference/landbell/ vorliegt,
// wird generateBefoerderungspapier in pdf.ts auf 'landbell' verzweigen und
// das dortige Layout nachbilden.
export const ENTSORGER_STANDARD: Entsorger[] = [
  {
    id: 'landbell',
    name: 'Landbell Group',
    firma: 'Landbell AG für Rückhol-Systeme',
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
      'Rücknahmesystem für Altbatterien. Abholung nach ADR-konformer Vorbereitung. ' +
      'Landbell-Kundennummer und ggf. Auftragsreferenz eintragen.',
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
