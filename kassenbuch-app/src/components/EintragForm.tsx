import { useState } from 'react';
import type { Eintrag } from '../types';
import { AUFTRAGSARTEN } from '../data/initialData';

interface Props {
  initial?: Eintrag;
  nextAuftragNr: number;
  kategorieCode: string;
  onSave: (eintrag: Omit<Eintrag, 'id'>) => void;
  onCancel: () => void;
}

export function EintragForm({ initial, nextAuftragNr, kategorieCode, onSave, onCancel }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    datum: initial?.datum || today,
    auftragsart: initial?.auftragsart || 'Leeren',
    standort: initial?.standort || '',
    behaeltertyp: initial?.behaeltertyp || '',
    firma: initial?.firma || '',
    menge_t: initial?.menge_t?.toString() || '',
    menge_m3: initial?.menge_m3?.toString() || '',
    menge_stk: initial?.menge_stk?.toString() || '',
    kosten: initial?.kosten?.toString() || '',
    reNr: initial?.reNr || '',
    auftragsNr: initial?.auftragsNr || nextAuftragNr.toString(),
    bemerkung: initial?.bemerkung || '',
    dauerauftrag: initial?.dauerauftrag || '',
  });

  function handle(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function submit() {
    onSave({
      datum: form.datum,
      auftragsart: form.auftragsart,
      standort: form.standort,
      behaeltertyp: form.behaeltertyp,
      firma: form.firma,
      menge_t: form.menge_t ? parseFloat(form.menge_t.replace(',', '.')) : undefined,
      menge_m3: form.menge_m3 ? parseFloat(form.menge_m3.replace(',', '.')) : undefined,
      menge_stk: form.menge_stk ? parseInt(form.menge_stk) : undefined,
      kosten: form.kosten ? parseFloat(form.kosten.replace(',', '.')) : undefined,
      reNr: form.reNr,
      auftragsNr: form.auftragsNr,
      bemerkung: form.bemerkung,
      dauerauftrag: form.dauerauftrag || undefined,
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-4 shadow-md">
        <button onClick={onCancel} className="text-green-200 text-sm mb-2">← Abbrechen</button>
        <h2 className="text-lg font-bold">{initial ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}</h2>
        <p className="text-green-300 text-xs">{kategorieCode}</p>
      </div>

      <div className="flex-1 px-4 py-4 space-y-3 pb-24">
        {/* Datum & Auftragsart */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <div>
            <label className="text-xs text-gray-500 font-medium">Auftragsdatum</label>
            <input
              type="date"
              value={form.datum}
              onChange={e => handle('datum', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Auftragsart</label>
            <select
              value={form.auftragsart}
              onChange={e => handle('auftragsart', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              {AUFTRAGSARTEN.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* Standort & Firma */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <div>
            <label className="text-xs text-gray-500 font-medium">Standort</label>
            <input
              type="text"
              value={form.standort}
              onChange={e => handle('standort', e.target.value)}
              placeholder="z.B. WEB, ASB, CHE"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Behältertyp</label>
            <input
              type="text"
              value={form.behaeltertyp}
              onChange={e => handle('behaeltertyp', e.target.value)}
              placeholder="z.B. 240l Umleerbehälter"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Firma / Entsorgungsunternehmen</label>
            <input
              type="text"
              value={form.firma}
              onChange={e => handle('firma', e.target.value)}
              placeholder="z.B. Veolia, Nehlsen, Remondis"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Menge */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="text-xs text-gray-500 font-medium">Menge</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <input
                type="number"
                value={form.menge_t}
                onChange={e => handle('menge_t', e.target.value)}
                placeholder="Tonnen (t)"
                step="0.01"
                className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="text-xs text-center text-gray-400 mt-0.5">t</div>
            </div>
            <div>
              <input
                type="number"
                value={form.menge_m3}
                onChange={e => handle('menge_m3', e.target.value)}
                placeholder="m³"
                step="0.1"
                className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="text-xs text-center text-gray-400 mt-0.5">m³</div>
            </div>
            <div>
              <input
                type="number"
                value={form.menge_stk}
                onChange={e => handle('menge_stk', e.target.value)}
                placeholder="Stück"
                className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="text-xs text-center text-gray-400 mt-0.5">Stk</div>
            </div>
          </div>
        </div>

        {/* Kosten & Nummern */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <div>
            <label className="text-xs text-gray-500 font-medium">Kosten (EUR)</label>
            <input
              type="number"
              value={form.kosten}
              onChange={e => handle('kosten', e.target.value)}
              placeholder="0,00"
              step="0.01"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 font-medium">Rechnungs-Nr.</label>
              <input
                type="text"
                value={form.reNr}
                onChange={e => handle('reNr', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Auftrags-Nr.</label>
              <input
                type="text"
                value={form.auftragsNr}
                onChange={e => handle('auftragsNr', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Bemerkung</label>
            <input
              type="text"
              value={form.bemerkung}
              onChange={e => handle('bemerkung', e.target.value)}
              placeholder="z.B. Gs, Dauerauftrag, …"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <button
          onClick={submit}
          className="w-full bg-green-600 text-white rounded-xl py-3 text-base font-semibold active:bg-green-700"
        >
          {initial ? 'Änderungen speichern' : 'Eintrag hinzufügen'}
        </button>
      </div>
    </div>
  );
}
