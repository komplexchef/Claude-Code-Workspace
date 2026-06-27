import { useState, useEffect } from 'react';
import type { AppData, Eintrag, Kategorie } from './types';
import { INITIAL_KATEGORIEN } from './data/initialData';

const STORAGE_KEY = 'kassenbuch-2026';

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    kategorien: INITIAL_KATEGORIEN.map(k => ({ ...k, eintraege: [] })),
  };
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useStore() {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  function addEintrag(kategorieId: string, eintrag: Omit<Eintrag, 'id'>) {
    const id = Date.now().toString();
    setData(prev => ({
      ...prev,
      kategorien: prev.kategorien.map(k =>
        k.id === kategorieId
          ? { ...k, eintraege: [...k.eintraege, { ...eintrag, id }] }
          : k
      ),
    }));
  }

  function updateEintrag(kategorieId: string, eintrag: Eintrag) {
    setData(prev => ({
      ...prev,
      kategorien: prev.kategorien.map(k =>
        k.id === kategorieId
          ? { ...k, eintraege: k.eintraege.map(e => e.id === eintrag.id ? eintrag : e) }
          : k
      ),
    }));
  }

  function deleteEintrag(kategorieId: string, eintragId: string) {
    setData(prev => ({
      ...prev,
      kategorien: prev.kategorien.map(k =>
        k.id === kategorieId
          ? { ...k, eintraege: k.eintraege.filter(e => e.id !== eintragId) }
          : k
      ),
    }));
  }

  function addKategorie(kategorie: Omit<Kategorie, 'eintraege'>) {
    setData(prev => ({
      ...prev,
      kategorien: [...prev.kategorien, { ...kategorie, eintraege: [] }],
    }));
  }

  function getNextAuftragNr(): number {
    let max = 0;
    data.kategorien.forEach(k => {
      k.eintraege.forEach(e => {
        const n = parseInt(e.auftragsNr);
        if (!isNaN(n) && n > max) max = n;
      });
    });
    return max + 1;
  }

  function exportData(): string {
    return JSON.stringify(data, null, 2);
  }

  function importData(json: string) {
    try {
      const parsed = JSON.parse(json);
      setData(parsed);
      return true;
    } catch {
      return false;
    }
  }

  return {
    data,
    addEintrag,
    updateEintrag,
    deleteEintrag,
    addKategorie,
    getNextAuftragNr,
    exportData,
    importData,
  };
}
