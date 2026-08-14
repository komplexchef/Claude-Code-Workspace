export type AkkuChemie =
  | 'lithium-ion'
  | 'lifepo4'
  | 'lithium-polymer'
  | 'lithium-metall'
  | 'nimh'
  | 'nicd'
  | 'blei-gel'
  | 'blei-saeure'
  | 'alkaline'
  | 'zink-kohle'
  | 'andere';

export const CHEMIE_LABEL: Record<AkkuChemie, string> = {
  'lithium-ion': 'Lithium-Ionen (Li-Ion)',
  'lifepo4': 'Lithium-Eisen-Phosphat (LiFePO4)',
  'lithium-polymer': 'Lithium-Polymer (LiPo)',
  'lithium-metall': 'Lithium-Metall',
  'nimh': 'Nickel-Metallhydrid (NiMH)',
  'nicd': 'Nickel-Cadmium (NiCd)',
  'blei-gel': 'Blei-Gel',
  'blei-saeure': 'Blei-Säure',
  'alkaline': 'Alkaline',
  'zink-kohle': 'Zink-Kohle',
  'andere': 'Andere',
};

export type AkkuZustand = 'intakt' | 'gebraucht' | 'defekt' | 'kritisch-defekt';

export const ZUSTAND_LABEL: Record<AkkuZustand, string> = {
  'intakt': 'Intakt / neuwertig',
  'gebraucht': 'Gebraucht / end-of-life',
  'defekt': 'Defekt',
  'kritisch-defekt': 'Kritisch defekt (Brand-/Auslaufgefahr)',
};

export type AdrUnNummer =
  | 'UN3480'
  | 'UN3481'
  | 'UN3090'
  | 'UN3091'
  | 'UN2800'
  | null;

export type AdrSv = 'SV376' | 'SV377' | 'SV188' | null;
export type AdrVerpackung = 'P801' | 'P903' | 'P909' | 'P909-PALOXE' | 'P911' | 'LP904' | null;
export type AdrKlasse = '8' | '9' | null;

export interface AdrKlassifizierung {
  unNummer: AdrUnNummer;
  bezeichnung: string;
  klasse: AdrKlasse;
  sv: AdrSv;
  verpackung: AdrVerpackung;
  hinweis: string;
}

export interface Akku {
  id: string;
  datum: string;
  foto?: string;
  hersteller: string;
  modell: string;
  chemie: AkkuChemie;
  zustand: AkkuZustand;
  inGeraet: boolean;
  spannungV?: number;
  kapazitaetWh?: number;
  gewichtKg: number;
  anzahl: number;
  seriennr?: string;
  bemerkung?: string;
  adr: AdrKlassifizierung;
}

export interface Adresse {
  strasse: string;
  plz: string;
  ort: string;
  land: string;
}

export interface Absender {
  firma: string;
  adresse: Adresse;
  ansprechpartner: string;
  telefon: string;
  email: string;
  kundenNr?: string;
}

export type EntsorgerFormat = 'landbell' | 'standard';

export interface Entsorger {
  id: string;
  name: string;
  firma: string;
  adresse: Adresse;
  email: string;
  ansprechpartner: string;
  telefon: string;
  hinweise: string;
  formatVorlage: EntsorgerFormat;
  editable: boolean;
}

export type SendungStatus = 'entwurf' | 'verpackt' | 'versendet';

export const STATUS_LABEL: Record<SendungStatus, string> = {
  'entwurf': 'Entwurf',
  'verpackt': 'Verpackt',
  'versendet': 'Versendet',
};

export interface Sendung {
  id: string;
  erstellt: string;
  status: SendungStatus;
  absender: Absender;
  entsorgerId: string;
  entsorgerOverride?: Entsorger;
  akkus: Akku[];
  abholungWunschdatum?: string;
  referenz?: string;
  bemerkung?: string;
  versendetAm?: string;
}

export interface AppData {
  sendungen: Sendung[];
  absenderVorlage: Absender;
  entsorgerCustom: Entsorger[];
}
