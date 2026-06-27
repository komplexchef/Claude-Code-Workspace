export interface Eintrag {
  id: string;
  datum: string;
  auftragsart: string;
  standort: string;
  behaeltertyp: string;
  firma: string;
  menge_t?: number;
  menge_m3?: number;
  menge_stk?: number;
  kosten?: number;
  reNr: string;
  auftragsNr: string;
  bemerkung: string;
  dauerauftrag?: string;
}

export interface Kategorie {
  id: string;
  code: string;
  name: string;
  eintraege: Eintrag[];
}

export type AppData = {
  kategorien: Kategorie[];
};
