import type { AdrKlassifizierung } from '../types';
import { getVerpackungsAnweisung } from '../adr';

interface Props {
  adr: AdrKlassifizierung;
  kompakt?: boolean;
}

export function AdrInfo({ adr, kompakt }: Props) {
  const vp = getVerpackungsAnweisung(adr.verpackung);
  const warn = adr.verpackung === 'P911';
  return (
    <div className={`rounded-xl border p-3 text-sm ${warn ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-200'}`}>
      <div className="flex items-center gap-2 font-semibold">
        <svg className={`h-4 w-4 ${warn ? 'text-red-600' : 'text-amber-600'}`}><use href="./icons.svg#i-warning"/></svg>
        <span>ADR-Klassifizierung</span>
      </div>
      <div className="mt-2 space-y-1">
        <div><span className="text-gray-500">UN:</span> <span className="font-mono">{adr.unNummer ?? '—'}</span></div>
        <div className="text-gray-800">{adr.bezeichnung}</div>
        <div className="flex flex-wrap gap-2 pt-1">
          {adr.klasse && <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-white">Klasse {adr.klasse}</span>}
          {adr.sv && <span className="rounded bg-blue-700 px-2 py-0.5 text-xs text-white">{adr.sv}</span>}
          {adr.verpackung && <span className={`rounded px-2 py-0.5 text-xs text-white ${warn ? 'bg-red-700' : 'bg-emerald-700'}`}>{adr.verpackung}</span>}
        </div>
        {!kompakt && (
          <p className="pt-2 text-xs text-gray-700">{adr.hinweis}</p>
        )}
        {!kompakt && vp && (
          <details className="pt-2 text-xs">
            <summary className="cursor-pointer font-semibold text-gray-700">Verpackungsanweisung {vp.code} anzeigen</summary>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-gray-700">
              {vp.punkte.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
