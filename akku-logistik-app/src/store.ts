import { useEffect, useState } from 'react';
import type { Absender, Akku, AppData, Entsorger, Sendung } from './types';

const STORAGE_KEY = 'akku-logistik-v1';

const LEERER_ABSENDER: Absender = {
  firma: '',
  adresse: { strasse: '', plz: '', ort: '', land: 'Deutschland' },
  ansprechpartner: '',
  telefon: '',
  email: '',
  kundenNr: '',
};

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {
    /* ignore */
  }
  return {
    sendungen: [],
    absenderVorlage: LEERER_ABSENDER,
    entsorgerCustom: [],
  };
}

function saveData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('localStorage voll?', err);
  }
}

function neueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function useStore() {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  function createSendung(entsorgerId = 'landbell'): Sendung {
    const s: Sendung = {
      id: neueId(),
      erstellt: new Date().toISOString(),
      status: 'entwurf',
      absender: { ...data.absenderVorlage },
      entsorgerId,
      akkus: [],
    };
    setData((p) => ({ ...p, sendungen: [s, ...p.sendungen] }));
    return s;
  }

  function updateSendung(sendungId: string, patch: Partial<Sendung>) {
    setData((p) => ({
      ...p,
      sendungen: p.sendungen.map((s) => (s.id === sendungId ? { ...s, ...patch } : s)),
    }));
  }

  function deleteSendung(sendungId: string) {
    setData((p) => ({
      ...p,
      sendungen: p.sendungen.filter((s) => s.id !== sendungId),
    }));
  }

  function addAkku(sendungId: string, akku: Omit<Akku, 'id'>) {
    const withId: Akku = { ...akku, id: neueId() };
    setData((p) => ({
      ...p,
      sendungen: p.sendungen.map((s) =>
        s.id === sendungId ? { ...s, akkus: [...s.akkus, withId] } : s,
      ),
    }));
  }

  function updateAkku(sendungId: string, akku: Akku) {
    setData((p) => ({
      ...p,
      sendungen: p.sendungen.map((s) =>
        s.id === sendungId
          ? { ...s, akkus: s.akkus.map((a) => (a.id === akku.id ? akku : a)) }
          : s,
      ),
    }));
  }

  function removeAkku(sendungId: string, akkuId: string) {
    setData((p) => ({
      ...p,
      sendungen: p.sendungen.map((s) =>
        s.id === sendungId ? { ...s, akkus: s.akkus.filter((a) => a.id !== akkuId) } : s,
      ),
    }));
  }

  function setAbsenderVorlage(absender: Absender) {
    setData((p) => ({ ...p, absenderVorlage: absender }));
  }

  function upsertCustomEntsorger(e: Entsorger) {
    setData((p) => ({
      ...p,
      entsorgerCustom: p.entsorgerCustom.some((x) => x.id === e.id)
        ? p.entsorgerCustom.map((x) => (x.id === e.id ? e : x))
        : [...p.entsorgerCustom, e],
    }));
  }

  function markSendungVersendet(sendungId: string) {
    updateSendung(sendungId, {
      status: 'versendet',
      versendetAm: new Date().toISOString(),
    });
  }

  function exportData(): string {
    return JSON.stringify(data, null, 2);
  }

  function importData(json: string): boolean {
    try {
      const parsed = JSON.parse(json) as AppData;
      if (!parsed.sendungen) return false;
      setData(parsed);
      return true;
    } catch {
      return false;
    }
  }

  return {
    data,
    createSendung,
    updateSendung,
    deleteSendung,
    addAkku,
    updateAkku,
    removeAkku,
    setAbsenderVorlage,
    upsertCustomEntsorger,
    markSendungVersendet,
    exportData,
    importData,
  };
}
