import type { Kategorie } from '../types';

interface Props {
  kategorien: Kategorie[];
  onSelect: (id: string) => void;
  onExport: () => void;
  onImport: () => void;
}

export function Uebersicht({ kategorien, onSelect, onExport, onImport }: Props) {
  const gesamtKosten = kategorien.reduce((sum, k) =>
    sum + k.eintraege.reduce((s, e) => s + (e.kosten || 0), 0), 0);

  const gesamtTonnen = kategorien.reduce((sum, k) =>
    sum + k.eintraege.reduce((s, e) => s + (e.menge_t || 0), 0), 0);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-5 shadow-md">
        <h1 className="text-xl font-bold">Aufträge & Rechnungen 2026</h1>
        <p className="text-green-200 text-sm mt-0.5">Abfallentsorgung — Übersicht</p>
        <div className="flex gap-4 mt-3">
          <div className="bg-green-800 rounded-lg px-3 py-2 flex-1 text-center">
            <div className="text-2xl font-bold">{gesamtKosten.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</div>
            <div className="text-green-300 text-xs">Gesamtkosten</div>
          </div>
          <div className="bg-green-800 rounded-lg px-3 py-2 flex-1 text-center">
            <div className="text-2xl font-bold">{gesamtTonnen.toLocaleString('de-DE', { maximumFractionDigits: 2 })} t</div>
            <div className="text-green-300 text-xs">Gesamtmenge</div>
          </div>
        </div>
      </div>

      {/* Kategorien Liste */}
      <div className="flex-1 px-3 py-4 space-y-2">
        {kategorien.map(k => {
          const kosten = k.eintraege.reduce((s, e) => s + (e.kosten || 0), 0);
          const tonnen = k.eintraege.reduce((s, e) => s + (e.menge_t || 0), 0);
          return (
            <button
              key={k.id}
              onClick={() => onSelect(k.id)}
              className="w-full bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 text-left active:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-semibold">{k.code}</span>
                    <span className="text-xs text-gray-400">{k.eintraege.length} Einträge</span>
                  </div>
                  <div className="text-sm font-medium text-gray-800 mt-1 truncate">{k.name}</div>
                </div>
                <div className="text-right ml-3 flex-shrink-0">
                  <div className="text-sm font-semibold text-gray-900">
                    {kosten > 0 ? kosten.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '—'}
                  </div>
                  {tonnen > 0 && (
                    <div className="text-xs text-gray-400">{tonnen.toFixed(2)} t</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Aktionen */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3">
        <button
          onClick={onExport}
          className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-2.5 text-sm font-medium active:bg-gray-200"
        >
          📤 Exportieren
        </button>
        <button
          onClick={onImport}
          className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-2.5 text-sm font-medium active:bg-gray-200"
        >
          📥 Importieren
        </button>
      </div>
    </div>
  );
}
