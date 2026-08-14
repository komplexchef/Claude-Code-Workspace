import type { Akku, Sendung } from '../types';
import { CHEMIE_LABEL, STATUS_LABEL, ZUSTAND_LABEL } from '../types';
import { berechneGesamtanzahl, berechneGesamtgewicht } from '../adr';

interface Props {
  sendung: Sendung;
  onBack: () => void;
  onAkkuAdd: () => void;
  onAkkuEdit: (a: Akku) => void;
  onAkkuDelete: (id: string) => void;
  onVersand: () => void;
  onDelete: () => void;
}

export function SendungView({ sendung, onBack, onAkkuAdd, onAkkuEdit, onAkkuDelete, onVersand, onDelete }: Props) {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="sticky top-0 z-10 bg-red-600 px-4 py-3 text-white shadow">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="rounded p-2 hover:bg-red-700" aria-label="Zurück">
            <svg className="h-5 w-5"><use href="./icons.svg#i-chevron-left"/></svg>
          </button>
          <div className="flex-1">
            <div className="text-xs opacity-80">Sendung {sendung.id}</div>
            <div className="text-lg font-bold">
              {new Date(sendung.erstellt).toLocaleDateString('de-DE')} · {STATUS_LABEL[sendung.status]}
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 pb-24">
        {sendung.akkus.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            Noch keine Akkus erfasst. Tippe auf <b>+</b>, um den ersten Akku aufzunehmen.
          </div>
        ) : (
          <ul className="space-y-2">
            {sendung.akkus.map((a) => (
              <li key={a.id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex gap-3 p-3">
                  {a.foto ? (
                    <img src={a.foto} alt="" className="h-20 w-20 flex-none rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 flex-none items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                      <svg className="h-8 w-8"><use href="./icons.svg#i-battery"/></svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <button onClick={() => onAkkuEdit(a)} className="block w-full text-left">
                      <div className="truncate font-semibold text-gray-900">
                        {a.hersteller || 'Ohne Hersteller'} {a.modell && `· ${a.modell}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {CHEMIE_LABEL[a.chemie]} · {ZUSTAND_LABEL[a.zustand]}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1 text-xs">
                        {a.adr.unNummer && <span className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-white">{a.adr.unNummer}</span>}
                        {a.adr.sv && <span className="rounded bg-blue-700 px-1.5 py-0.5 text-white">{a.adr.sv}</span>}
                        {a.adr.verpackung && <span className={`rounded px-1.5 py-0.5 text-white ${a.adr.verpackung === 'P911' ? 'bg-red-700' : 'bg-emerald-700'}`}>{a.adr.verpackung}</span>}
                        <span className="text-gray-500">· {a.gewichtKg.toFixed(2)} kg × {a.anzahl}</span>
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={() => { if (confirm('Diesen Akku löschen?')) onAkkuDelete(a.id); }}
                    className="flex-none rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                    aria-label="Löschen"
                  >
                    <svg className="h-5 w-5"><use href="./icons.svg#i-trash"/></svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {sendung.akkus.length > 0 && (
          <div className="mt-4 rounded-xl bg-gray-100 p-3 text-sm text-gray-700">
            <div>Positionen: <b>{sendung.akkus.length}</b></div>
            <div>Akkus insgesamt: <b>{berechneGesamtanzahl(sendung.akkus)}</b></div>
            <div>Nettogewicht: <b>{berechneGesamtgewicht(sendung.akkus).toFixed(2)} kg</b></div>
          </div>
        )}

        <div className="mt-6 space-y-2">
          <button
            onClick={onVersand}
            disabled={sendung.akkus.length === 0}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow disabled:bg-gray-300"
          >
            Versand vorbereiten &amp; PDFs erstellen
          </button>
          <button
            onClick={() => { if (confirm('Ganze Sendung löschen?')) onDelete(); }}
            className="w-full rounded-xl bg-white py-3 text-sm text-red-600 border border-red-200"
          >
            Sendung löschen
          </button>
        </div>
      </main>

      <button
        onClick={onAkkuAdd}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg active:bg-red-700"
        aria-label="Akku hinzufügen"
      >
        <svg className="h-7 w-7"><use href="./icons.svg#i-plus"/></svg>
      </button>
    </div>
  );
}
