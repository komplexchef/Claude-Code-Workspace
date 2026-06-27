import type { Kategorie, Eintrag } from '../types';

interface Props {
  kategorie: Kategorie;
  onBack: () => void;
  onAdd: () => void;
  onEdit: (eintrag: Eintrag) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export function KategorieView({ kategorie, onBack, onAdd, onEdit, onDelete }: Props) {
  const gesamtKosten = kategorie.eintraege.reduce((s, e) => s + (e.kosten || 0), 0);
  const sortedEntries = [...kategorie.eintraege].sort((a, b) =>
    new Date(b.datum).getTime() - new Date(a.datum).getTime()
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-4 shadow-md">
        <button onClick={onBack} className="flex items-center gap-1 text-green-200 text-sm mb-2">
          ← Übersicht
        </button>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs bg-green-600 px-1.5 py-0.5 rounded font-mono">{kategorie.code}</span>
            <h2 className="text-base font-bold mt-1 max-w-[220px]">{kategorie.name}</h2>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">
              {gesamtKosten.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </div>
            <div className="text-green-300 text-xs">{kategorie.eintraege.length} Einträge</div>
          </div>
        </div>
      </div>

      {/* Einträge */}
      <div className="flex-1 px-3 py-3 space-y-2 pb-24">
        {sortedEntries.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <div className="text-4xl mb-2">📋</div>
            <div>Keine Einträge vorhanden</div>
          </div>
        ) : (
          sortedEntries.map(e => (
            <div
              key={e.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">{e.auftragsart}</span>
                    <span className="text-xs text-gray-500">{formatDate(e.datum)}</span>
                    {e.auftragsNr && <span className="text-xs text-gray-400">#{e.auftragsNr}</span>}
                  </div>
                  <div className="text-sm font-semibold text-gray-800 mt-1">{e.standort || '—'}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{e.firma}</div>
                  {e.behaeltertyp && <div className="text-xs text-gray-400">{e.behaeltertyp}</div>}
                  <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                    {e.menge_t != null && e.menge_t > 0 && <span>{e.menge_t} t</span>}
                    {e.menge_m3 != null && e.menge_m3 > 0 && <span>{e.menge_m3} m³</span>}
                    {e.menge_stk != null && e.menge_stk > 0 && <span>{e.menge_stk} Stk</span>}
                    {e.reNr && <span>Re: {e.reNr}</span>}
                  </div>
                  {e.bemerkung && <div className="text-xs text-gray-400 mt-1 italic">{e.bemerkung}</div>}
                </div>
                <div className="ml-3 text-right flex-shrink-0">
                  <div className="text-sm font-bold text-gray-900">
                    {e.kosten != null ? e.kosten.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '—'}
                  </div>
                  <div className="flex gap-1 mt-2">
                    <button
                      onClick={() => onEdit(e)}
                      className="text-xs bg-gray-100 px-2 py-1 rounded active:bg-gray-200"
                    >✏️</button>
                    <button
                      onClick={() => { if (confirm('Eintrag löschen?')) onDelete(e.id); }}
                      className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded active:bg-red-100"
                    >🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-5 right-5">
        <button
          onClick={onAdd}
          className="bg-green-600 text-white w-14 h-14 rounded-full shadow-lg text-2xl flex items-center justify-center active:bg-green-700"
        >
          +
        </button>
      </div>
    </div>
  );
}
