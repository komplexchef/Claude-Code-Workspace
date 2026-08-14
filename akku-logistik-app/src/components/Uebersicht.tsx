import type { Sendung } from '../types';
import { STATUS_LABEL } from '../types';
import { berechneGesamtanzahl, berechneGesamtgewicht } from '../adr';

interface Props {
  sendungen: Sendung[];
  onOpen: (id: string) => void;
  onNeu: () => void;
  onExport: () => void;
  onImport: () => void;
  onSettings: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  entwurf: 'bg-gray-200 text-gray-800',
  verpackt: 'bg-amber-200 text-amber-900',
  versendet: 'bg-emerald-200 text-emerald-900',
};

export function Uebersicht({ sendungen, onOpen, onNeu, onExport, onImport, onSettings }: Props) {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="sticky top-0 z-10 bg-red-600 px-4 py-3 text-white shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6"><use href="./icons.svg#i-battery"/></svg>
            <h1 className="text-lg font-bold">Akku-Logistik</h1>
          </div>
          <div className="flex gap-1">
            <button onClick={onImport} title="JSON importieren" className="rounded p-2 hover:bg-red-700">
              <svg className="h-5 w-5"><use href="./icons.svg#i-import"/></svg>
            </button>
            <button onClick={onExport} title="JSON exportieren" className="rounded p-2 hover:bg-red-700">
              <svg className="h-5 w-5"><use href="./icons.svg#i-export"/></svg>
            </button>
            <button onClick={onSettings} title="Einstellungen" className="rounded p-2 hover:bg-red-700">
              <svg className="h-5 w-5"><use href="./icons.svg#i-settings"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 pb-24">
        {sendungen.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            <p>Noch keine Sendungen.</p>
            <p className="mt-2 text-sm">Tippe unten auf <b>+</b>, um deine erste Sendung anzulegen.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sendungen.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => onOpen(s.id)}
                  className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm active:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {new Date(s.erstellt).toLocaleDateString('de-DE')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {s.akkus.length} Positionen · {berechneGesamtanzahl(s.akkus)} Akkus · {berechneGesamtgewicht(s.akkus).toFixed(1)} kg
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[s.status]}`}>
                      {STATUS_LABEL[s.status]}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <button
        onClick={onNeu}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg active:bg-red-700"
        aria-label="Neue Sendung"
      >
        <svg className="h-7 w-7"><use href="./icons.svg#i-plus"/></svg>
      </button>
    </div>
  );
}
