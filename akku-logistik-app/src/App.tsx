import { useRef, useState } from 'react';
import type { Akku } from './types';
import { useStore } from './store';
import { Uebersicht } from './components/Uebersicht';
import { SendungView } from './components/SendungView';
import { AkkuForm } from './components/AkkuForm';
import { VersandDialog } from './components/VersandDialog';

type View =
  | { type: 'uebersicht' }
  | { type: 'sendung'; id: string }
  | { type: 'akku-form'; sendungId: string; akku?: Akku }
  | { type: 'versand'; sendungId: string };

export default function App() {
  const store = useStore();
  const [view, setView] = useState<View>({ type: 'uebersicht' });
  const importRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = store.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `akku-logistik-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    importRef.current?.click();
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = store.importData(ev.target?.result as string);
      alert(ok ? 'Daten erfolgreich importiert.' : 'Import fehlgeschlagen — bitte JSON prüfen.');
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleNeueSendung() {
    const s = store.createSendung();
    setView({ type: 'sendung', id: s.id });
  }

  const importInput = (
    <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
  );

  if (view.type === 'uebersicht') {
    return (
      <>
        {importInput}
        <Uebersicht
          sendungen={store.data.sendungen}
          onOpen={(id) => setView({ type: 'sendung', id })}
          onNeu={handleNeueSendung}
          onExport={handleExport}
          onImport={handleImportClick}
          onSettings={() => alert('Einstellungen kommen in einer späteren Version — Absender-Vorlage wird derzeit aus der letzten Sendung übernommen.')}
        />
      </>
    );
  }

  if (view.type === 'sendung') {
    const sendung = store.data.sendungen.find((s) => s.id === view.id);
    if (!sendung) {
      setView({ type: 'uebersicht' });
      return null;
    }
    return (
      <SendungView
        sendung={sendung}
        onBack={() => setView({ type: 'uebersicht' })}
        onAkkuAdd={() => setView({ type: 'akku-form', sendungId: view.id })}
        onAkkuEdit={(a) => setView({ type: 'akku-form', sendungId: view.id, akku: a })}
        onAkkuDelete={(id) => store.removeAkku(view.id, id)}
        onVersand={() => setView({ type: 'versand', sendungId: view.id })}
        onDelete={() => {
          store.deleteSendung(view.id);
          setView({ type: 'uebersicht' });
        }}
      />
    );
  }

  if (view.type === 'akku-form') {
    return (
      <AkkuForm
        initial={view.akku}
        onCancel={() => setView({ type: 'sendung', id: view.sendungId })}
        onSave={(akku) => {
          if (view.akku) {
            store.updateAkku(view.sendungId, { ...akku, id: view.akku.id });
          } else {
            store.addAkku(view.sendungId, akku);
          }
          setView({ type: 'sendung', id: view.sendungId });
        }}
      />
    );
  }

  if (view.type === 'versand') {
    const sendung = store.data.sendungen.find((s) => s.id === view.sendungId);
    if (!sendung) {
      setView({ type: 'uebersicht' });
      return null;
    }
    return (
      <VersandDialog
        sendung={sendung}
        customEntsorger={store.data.entsorgerCustom}
        onClose={() => setView({ type: 'sendung', id: view.sendungId })}
        onUpdate={(patch) => {
          store.updateSendung(view.sendungId, patch);
          if (patch.absender) store.setAbsenderVorlage(patch.absender);
        }}
        onVersendet={() => store.markSendungVersendet(view.sendungId)}
      />
    );
  }

  return null;
}
