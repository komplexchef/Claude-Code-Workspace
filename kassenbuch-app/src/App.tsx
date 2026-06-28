import { useState, useRef } from 'react';
import { useStore } from './store';
import { Uebersicht } from './components/Uebersicht';
import { KategorieView } from './components/KategorieView';
import { EintragForm } from './components/EintragForm';
import type { Eintrag } from './types';

type View =
  | { type: 'uebersicht' }
  | { type: 'kategorie'; id: string }
  | { type: 'form'; kategorieId: string; eintrag?: Eintrag };

export default function App() {
  const store = useStore();
  const [view, setView] = useState<View>({ type: 'uebersicht' });
  const importRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const data = store.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kassenbuch-2026-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    importRef.current?.click();
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const ok = store.importData(text);
      if (ok) alert('Daten erfolgreich importiert!');
      else alert('Fehler beim Import — bitte JSON-Datei prüfen.');
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  if (view.type === 'uebersicht') {
    return (
      <>
        <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
        <Uebersicht
          kategorien={store.data.kategorien}
          onSelect={id => setView({ type: 'kategorie', id })}
          onExport={handleExport}
          onImport={handleImport}
        />
      </>
    );
  }

  if (view.type === 'kategorie') {
    const kategorie = store.data.kategorien.find(k => k.id === view.id);
    if (!kategorie) return null;
    return (
      <KategorieView
        kategorie={kategorie}
        onBack={() => setView({ type: 'uebersicht' })}
        onAdd={() => setView({ type: 'form', kategorieId: view.id })}
        onEdit={eintrag => setView({ type: 'form', kategorieId: view.id, eintrag })}
        onDelete={id => store.deleteEintrag(view.id, id)}
      />
    );
  }

  if (view.type === 'form') {
    const kategorie = store.data.kategorien.find(k => k.id === view.kategorieId);
    if (!kategorie) return null;
    return (
      <EintragForm
        initial={view.eintrag}
        nextAuftragNr={store.getNextAuftragNr()}
        kategorieCode={`${kategorie.code} — ${kategorie.name}`}
        onCancel={() => setView({ type: 'kategorie', id: view.kategorieId })}
        onSave={eintrag => {
          if (view.eintrag) {
            store.updateEintrag(view.kategorieId, { ...eintrag, id: view.eintrag.id });
          } else {
            store.addEintrag(view.kategorieId, eintrag);
          }
          setView({ type: 'kategorie', id: view.kategorieId });
        }}
      />
    );
  }

  return null;
}
