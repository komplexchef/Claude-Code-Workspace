import type { Kategorie } from '../types';

export const AUFTRAGSARTEN = ['Leeren', 'Wechsel', 'Abholung', 'Handling', 'Anlieferung', 'Sonstiges'];

export const INITIAL_KATEGORIEN: Omit<Kategorie, 'eintraege'>[] = [
  { id: '150101', code: '150101', name: 'Verpackungen aus Papier und Pappe' },
  { id: '150102', code: '150102', name: 'Verpackungen aus Kunststoff (Styropor)' },
  { id: '150106', code: '150106', name: 'Gemischte Verpackungen (gelber Sack)' },
  { id: '150107', code: '150107', name: 'Verpackungen aus Glas' },
  { id: '150203', code: '150203', name: 'Aufsaug- und Filtermaterial (Luftfilter)' },
  { id: '160103', code: '160103', name: 'Altreifen' },
  { id: '160117', code: '160117', name: 'Eisenmetalle' },
  { id: '170101', code: '170101', name: 'Beton' },
  { id: '170107', code: '170107', name: 'Gemische aus Beton, Ziegeln, Fliesen' },
  { id: '170201', code: '170201', name: 'Holz' },
  { id: '170202', code: '170202', name: 'Glas' },
  { id: '170302', code: '170302', name: 'Bituminöses Mischgut' },
  { id: '170405', code: '170405', name: 'Eisen und Stahl' },
  { id: '170904', code: '170904', name: 'Gemischte Bau- und Abbruchabfälle' },
  { id: '200108', code: '200108', name: 'Bioabfälle' },
  { id: '200123', code: '200123', name: 'Leuchtstoffröhren' },
  { id: '200136', code: '200136', name: 'Elektro-/Elektronikaltgeräte' },
  { id: '200201', code: '200201', name: 'Biologisch abbaubare Abfälle (Grün)' },
  { id: '200301', code: '200301', name: 'Gemischte Siedlungsabfälle' },
  { id: '200307', code: '200307', name: 'Sperrmüll' },
  { id: 'gefaehrlich', code: 'GEF', name: 'Gefährliche Stoffe' },
  { id: 'sonstige', code: 'SONST', name: 'Sonstige' },
];
