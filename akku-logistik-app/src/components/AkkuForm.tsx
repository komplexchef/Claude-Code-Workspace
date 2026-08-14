import { useMemo, useState } from 'react';
import type { Akku, AkkuChemie, AkkuZustand } from '../types';
import { CHEMIE_LABEL, ZUSTAND_LABEL } from '../types';
import { klassifiziereAkku } from '../adr';
import { compressImage, getBase64SizeKB, pickPhoto } from '../photo';
import { AdrInfo } from './AdrInfo';

interface Props {
  initial?: Akku;
  onCancel: () => void;
  onSave: (akku: Omit<Akku, 'id'>) => void;
}

export function AkkuForm({ initial, onCancel, onSave }: Props) {
  const [foto, setFoto] = useState<string | undefined>(initial?.foto);
  const [hersteller, setHersteller] = useState(initial?.hersteller ?? '');
  const [modell, setModell] = useState(initial?.modell ?? '');
  const [chemie, setChemie] = useState<AkkuChemie>(initial?.chemie ?? 'lithium-ion');
  const [zustand, setZustand] = useState<AkkuZustand>(initial?.zustand ?? 'gebraucht');
  const [inGeraet, setInGeraet] = useState(initial?.inGeraet ?? false);
  const [spannungV, setSpannungV] = useState<string>(initial?.spannungV != null ? String(initial.spannungV) : '');
  const [kapazitaetWh, setKapazitaetWh] = useState<string>(initial?.kapazitaetWh != null ? String(initial.kapazitaetWh) : '');
  const [gewichtKg, setGewichtKg] = useState<string>(initial?.gewichtKg != null ? String(initial.gewichtKg) : '');
  const [anzahl, setAnzahl] = useState<string>(String(initial?.anzahl ?? 1));
  const [seriennr, setSeriennr] = useState(initial?.seriennr ?? '');
  const [bemerkung, setBemerkung] = useState(initial?.bemerkung ?? '');
  const [aufnehmend, setAufnehmend] = useState(false);

  const adr = useMemo(() => klassifiziereAkku(chemie, zustand, inGeraet), [chemie, zustand, inGeraet]);

  async function handleFoto() {
    setAufnehmend(true);
    try {
      const file = await pickPhoto();
      if (file) setFoto(await compressImage(file));
    } catch (err) {
      alert('Foto konnte nicht verarbeitet werden: ' + (err as Error).message);
    } finally {
      setAufnehmend(false);
    }
  }

  function handleSave() {
    const g = parseFloat(gewichtKg.replace(',', '.'));
    if (isNaN(g) || g <= 0) {
      alert('Bitte gültiges Gewicht in kg angeben.');
      return;
    }
    const a = parseInt(anzahl);
    if (!a || a < 1) {
      alert('Anzahl muss mindestens 1 sein.');
      return;
    }
    onSave({
      datum: initial?.datum ?? new Date().toISOString(),
      foto,
      hersteller,
      modell,
      chemie,
      zustand,
      inGeraet,
      spannungV: spannungV ? parseFloat(spannungV.replace(',', '.')) : undefined,
      kapazitaetWh: kapazitaetWh ? parseFloat(kapazitaetWh.replace(',', '.')) : undefined,
      gewichtKg: g,
      anzahl: a,
      seriennr: seriennr || undefined,
      bemerkung: bemerkung || undefined,
      adr,
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="sticky top-0 z-10 bg-red-600 px-4 py-3 text-white shadow">
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="rounded p-2 hover:bg-red-700" aria-label="Zurück">
            <svg className="h-5 w-5"><use href="./icons.svg#i-chevron-left"/></svg>
          </button>
          <h1 className="text-lg font-bold">{initial ? 'Akku bearbeiten' : 'Neuer Akku'}</h1>
        </div>
      </header>

      <main className="space-y-4 p-4 pb-32">
        <section className="rounded-xl bg-white p-3 shadow-sm">
          <div className="mb-2 text-sm font-semibold text-gray-700">Foto</div>
          {foto ? (
            <div className="relative">
              <img src={foto} alt="Akku" className="w-full rounded-lg" />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <button onClick={handleFoto} className="rounded bg-gray-100 px-3 py-1">Neu aufnehmen</button>
                <span>{getBase64SizeKB(foto)} KB</span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleFoto}
              disabled={aufnehmend}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-8 text-gray-500 active:bg-gray-50"
            >
              <svg className="h-6 w-6"><use href="./icons.svg#i-camera"/></svg>
              {aufnehmend ? 'Verarbeite …' : 'Foto aufnehmen'}
            </button>
          )}
        </section>

        <section className="rounded-xl bg-white p-3 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <Feld label="Hersteller" value={hersteller} onChange={setHersteller} placeholder="z.B. Samsung" />
            <Feld label="Modell / Typ" value={modell} onChange={setModell} placeholder="INR18650-25R" />
            <Feld label="Spannung [V]" value={spannungV} onChange={setSpannungV} inputMode="decimal" placeholder="3.7" />
            <Feld label="Kapazität [Wh]" value={kapazitaetWh} onChange={setKapazitaetWh} inputMode="decimal" placeholder="9.25" />
            <Feld label="Gewicht/Stk. [kg] *" value={gewichtKg} onChange={setGewichtKg} inputMode="decimal" placeholder="0.045" />
            <Feld label="Anzahl *" value={anzahl} onChange={setAnzahl} inputMode="numeric" placeholder="1" />
            <div className="col-span-2">
              <Feld label="Seriennr." value={seriennr} onChange={setSeriennr} />
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-white p-3 shadow-sm">
          <label className="mb-1 block text-sm font-semibold text-gray-700">Chemie</label>
          <select value={chemie} onChange={(e) => setChemie(e.target.value as AkkuChemie)} className="mb-3 w-full rounded-lg border border-gray-300 p-2">
            {(Object.keys(CHEMIE_LABEL) as AkkuChemie[]).map((c) => (
              <option key={c} value={c}>{CHEMIE_LABEL[c]}</option>
            ))}
          </select>

          <label className="mb-1 block text-sm font-semibold text-gray-700">Zustand</label>
          <select value={zustand} onChange={(e) => setZustand(e.target.value as AkkuZustand)} className="mb-3 w-full rounded-lg border border-gray-300 p-2">
            {(Object.keys(ZUSTAND_LABEL) as AkkuZustand[]).map((z) => (
              <option key={z} value={z}>{ZUSTAND_LABEL[z]}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={inGeraet} onChange={(e) => setInGeraet(e.target.checked)} />
            In Gerät verbaut (UN 3481/3091)
          </label>
        </section>

        <AdrInfo adr={adr} />

        <section className="rounded-xl bg-white p-3 shadow-sm">
          <label className="mb-1 block text-sm font-semibold text-gray-700">Bemerkung</label>
          <textarea
            value={bemerkung}
            onChange={(e) => setBemerkung(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
            placeholder="z.B. aufgequollen, Elektrolyt ausgetreten …"
          />
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-gray-200 bg-white p-3">
        <button onClick={onCancel} className="flex-1 rounded-lg bg-gray-100 py-3 font-medium text-gray-700">Abbrechen</button>
        <button onClick={handleSave} className="flex-1 rounded-lg bg-red-600 py-3 font-semibold text-white">Speichern</button>
      </div>
    </div>
  );
}

function Feld({
  label, value, onChange, placeholder, inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: 'text' | 'decimal' | 'numeric';
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 p-2 text-sm"
      />
    </div>
  );
}
