# Plan: Akku-Logistik PWA (ADR-konform)

**Erstellt:** 2026-06-29
**Status:** Implementiert
**Anforderung:** ADR-konforme PWA zur Erfassung defekter Akkus mit Foto, Inventarliste, Verpackungsanweisungen und PDF-Versandauftrag per E-Mail an Spediteur.

---

## Überblick

### Was dieser Plan erreicht

Eine mobil nutzbare PWA (`akku-logistik-app`) erfassen defekter Lithium-Akkus mit Foto und Metadaten, klassifiziert sie nach ADR (UN 3480/3481/3090/3091, SV 376/377), zeigt die korrekten Verpackungsanweisungen (P909/P911/LP904) an und generiert PDF-Dokumente (Inventarliste, Beförderungspapier, Packliste), die per E-Mail an den Spediteur geschickt werden können.

### Warum das wichtig ist

Defekte Lithium-Akkus sind Gefahrgut der Klasse 9 und unterliegen strengen ADR-Vorschriften. Ein fehlerhafter Versand kann zu Bußgeldern, Brandgefahr oder Annahmeverweigerung führen. Diese App reduziert manuellen Aufwand, vermeidet Dokumentationsfehler und stellt sicher, dass jeder Versand rechtskonform vorbereitet wird — direkt vom Smartphone aus, auch ohne Internet.

---

## Aktueller Zustand

### Relevante bestehende Struktur

- `kassenbuch-app/` — Bestehende PWA als technisches Vorbild (React 19 + Vite 8 + TypeScript + Tailwind 4 + localStorage). Sie liefert die Patterns für: View-Router, Store-Hook, JSON-Export/Import, PWA-Manifest, mobile-first UI mit Tailwind.
- `CLAUDE.md` — Workspace-Dokumentation, die nach der Implementierung erweitert werden muss.
- `context/strategy.md` — Erwähnt "Gefahrgut & Gewässerschutz ist logisch strukturiert und gut dokumentiert" als Erfolgsindikator → diese App zahlt direkt darauf ein.
- `plans/` — Verzeichnis für diesen Plan (wurde frisch angelegt).
- Branch: `claude/battery-logistics-app-vhzhwe` (bereits aktiv ausgecheckt).

### Lücken oder Probleme, die adressiert werden

- Keine bestehende Lösung für Akku-Erfassung im Workspace.
- Manuelle Gefahrgut-Dokumentation ist fehleranfällig und zeitintensiv.
- Fotodokumentation defekter Akkus läuft heute ad-hoc über die Galerie ohne Verknüpfung zum Versandauftrag.
- ADR-Klassifizierung (SV 376/377, P909/P911) ist regulatorisch komplex und ohne Hilfe leicht falsch.

---

## Vorgeschlagene Änderungen

### Zusammenfassung der Änderungen

- Neues App-Verzeichnis `akku-logistik-app/` parallel zu `kassenbuch-app/` anlegen (React 19 + Vite 8 + TypeScript + Tailwind 4 PWA).
- Datenmodell für Akku-Einträge (mit Foto, ADR-Klassifizierung, Zustand, Gewicht, Spannung).
- ADR-Regelwerk-Modul (`adr.ts`) mit Klassifizierungs-Logik und Verpackungsanweisungen.
- Foto-Erfassung über `getUserMedia` / `<input capture>` mit Komprimierung und Base64-Speicherung in localStorage.
- PDF-Generierung clientseitig (jsPDF) für Inventarliste, ADR-Beförderungspapier und Packliste.
- E-Mail-Versand-Mechanismus über `mailto:` mit angehängten/verlinkten PDF-Dateien (Browser-Limit beachten → Fallback: PDF-Download + manuelles Anhängen).
- Offline-fähig durch Service Worker mit Workbox.
- CLAUDE.md um neues App-Verzeichnis und Hinweise erweitern.

### Neue Dateien erstellen

| Dateipfad | Zweck |
| --- | --- |
| `akku-logistik-app/package.json` | NPM-Manifest mit Dependencies (React 19, Vite 8, jsPDF, Workbox) |
| `akku-logistik-app/index.html` | HTML-Einstieg mit Viewport-Meta, Theme-Color, Manifest-Link |
| `akku-logistik-app/vite.config.ts` | Vite-Konfiguration mit React-Plugin und korrekter `base`-URL |
| `akku-logistik-app/tsconfig.json` | TypeScript-Wurzel-Config (References auf app + node) |
| `akku-logistik-app/tsconfig.app.json` | App-spezifische TypeScript-Config |
| `akku-logistik-app/tsconfig.node.json` | Node/Vite TypeScript-Config |
| `akku-logistik-app/tailwind.config.js` | Tailwind 4 Konfiguration |
| `akku-logistik-app/postcss.config.js` | PostCSS mit Tailwind + Autoprefixer |
| `akku-logistik-app/.oxlintrc.json` | Linter-Regeln (analog zu kassenbuch-app) |
| `akku-logistik-app/.gitignore` | Standard-Ignore für node_modules, dist etc. |
| `akku-logistik-app/README.md` | Kurz-Doku: Setup, Dev-Server, Build, ADR-Disclaimer |
| `akku-logistik-app/public/manifest.json` | PWA-Manifest (Name, Theme, Icons) |
| `akku-logistik-app/public/favicon.svg` | App-Icon (Akku-Symbol) |
| `akku-logistik-app/public/icons.svg` | SVG-Sprite mit UI-Icons (Kamera, Trash, Export, Plus, etc.) |
| `akku-logistik-app/public/sw.js` | Service Worker für Offline-Fähigkeit |
| `akku-logistik-app/src/main.tsx` | React-Einstiegspunkt mit Service-Worker-Registrierung |
| `akku-logistik-app/src/index.css` | Tailwind-Imports und globale Styles |
| `akku-logistik-app/src/App.tsx` | Root-Komponente mit View-Router |
| `akku-logistik-app/src/types.ts` | TypeScript-Typen: `Akku`, `Sendung`, `AdrKlasse`, `AkkuTyp`, `Zustand` |
| `akku-logistik-app/src/store.ts` | `useStore`-Hook mit localStorage-Persistenz |
| `akku-logistik-app/src/adr.ts` | ADR-Klassifizierungs-Logik und Verpackungsregeln |
| `akku-logistik-app/src/pdf.ts` | PDF-Generierung (Inventarliste, Beförderungspapier, Packliste) |
| `akku-logistik-app/src/photo.ts` | Foto-Capture und Komprimierung (Canvas API) |
| `akku-logistik-app/src/data/entsorger.ts` | Vorkonfigurierte Entsorger (Landbell Group als Standard, "Eigener Entsorger" als Custom-Slot) |
| `akku-logistik-app/src/components/Uebersicht.tsx` | Startbildschirm mit Sendungs-Liste + "Neue Sendung"-Button |
| `akku-logistik-app/src/components/SendungView.tsx` | Detailansicht einer Sendung mit Akku-Liste + Versand-Button |
| `akku-logistik-app/src/components/AkkuForm.tsx` | Formular zur Akku-Erfassung mit Foto-Aufnahme |
| `akku-logistik-app/src/components/AdrInfo.tsx` | Komponente zur Anzeige der ADR-Klassifizierung & Verpackungshinweise |
| `akku-logistik-app/src/components/VersandDialog.tsx` | PDF-Vorschau, Spediteur-Auswahl, E-Mail-Versand |
| `plans/2026-06-29-akku-logistik-pwa.md` | Dieses Plan-Dokument |

### Zu ändernde Dateien

| Dateipfad | Änderungen |
| --- | --- |
| `CLAUDE.md` | Neue App im Abschnitt "Workspace-Struktur" ergänzen, Hinweis in "Notizen" zu Apps |

### Zu löschende Dateien (falls vorhanden)

Keine.

---

## Design-Entscheidungen

### Getroffene Schlüsselentscheidungen

1. **Stack 1:1 wie `kassenbuch-app`** (React 19, Vite 8, TS, Tailwind 4, localStorage): Konsistenz im Workspace, vorhandenes Know-how, schnelle Umsetzung, weniger zu pflegende Abhängigkeiten.
2. **PWA statt nativer App**: Schneller installierbar (kein Store), funktioniert auf iOS + Android + Desktop gleichermaßen, Kamera-Zugriff über Web-APIs ausreichend.
3. **localStorage statt IndexedDB**: Reicht für mittelgroße Datenmengen (Fotos werden komprimiert auf ~80 KB JPEG, Limit ~5 MB → ~60 Akkus). Pattern identisch zu kassenbuch-app. Bei Bedarf später migrierbar.
4. **Foto-Komprimierung im Browser**: Canvas-API skaliert auf max. 1280px Längskante, JPEG-Quality 0.7. Hält localStorage klein und Versand-PDFs handhabbar.
5. **PDF clientseitig mit jsPDF**: Keine Server-Abhängigkeit, Offline-fähig, ausreichende Qualität für Beförderungspapier (DIN A4, monochrom, Tabellen).
6. **Landbell Group als vorkonfigurierter Auftragsentsorger**: User arbeitet regelmäßig mit Landbell (Rücknahmesystem für Altbatterien). Vorbelegung spart Zeit; „Eigener Entsorger" bleibt für Ausnahmefälle wählbar. Landbell-spezifisches PDF-Format wird nachgezogen, sobald deren Dokument in `reference/landbell/` liegt.
7. **Feingliedrige Chemien-Liste**: Li-Ion, LiFePO4, Li-Polymer, Li-Metall, NiMH, NiCd, Blei-Gel, Blei-Säure, Alkaline, Zink-Kohle. LiFePO4 separat, weil thermisch stabiler und in der Praxis anders zu bewerten (trotz gleicher UN-Nummer). Erlaubt spätere Auswertung/Statistik nach Chemie.
8. **E-Mail-Versand per `mailto:` mit PDF-Download als Fallback**: Da `mailto:` keine Anhänge erlaubt, lädt die App PDFs lokal herunter und öffnet einen vorbefüllten Mail-Entwurf — der Nutzer hängt die PDFs manuell an. Einfach, browserweit kompatibel, keine Server-Infrastruktur nötig.
9. **ADR-Logik als reine Datenfunktion (`adr.ts`)**: Trennung von Regelwerk und UI, leicht testbar, später erweiterbar (z.B. SV 188 für Versand kleiner Mengen).
10. **Sendung als oberstes Aggregat**: Mehrere Akkus werden zu einer Sendung gebündelt → eine Sendung = ein Versandauftrag = ein PDF-Bündel. Spiegelt die reale Logistik.
11. **Keine Backend-/Cloud-Komponente in v1**: Daten bleiben auf dem Gerät, Export/Import über JSON-Datei (Pattern aus kassenbuch-app). Datenschutz-freundlich, kein DSGVO-Aufwand.
12. **Branch `claude/battery-logistics-app-vhzhwe`** (vorgegeben): Hier wird alles entwickelt, kein PR ohne explizite User-Aufforderung.

### Betrachtete Alternativen

- **Native iOS/Android-App**: Verworfen — deutlich höherer Aufwand (zwei Codebasen oder React Native), Store-Prozess, Updates langsamer. PWA reicht für die Anforderungen.
- **Backend mit Datenbank**: Verworfen für v1 — kein Hosting nötig, Datenschutz einfacher, später nachrüstbar.
- **IndexedDB für Fotos**: Verworfen für v1 — localStorage mit Komprimierung reicht. Migration zu IndexedDB ist später ein klar abgrenzbarer Refactor.
- **Server-side PDF-Generierung**: Verworfen — verletzt Offline-Anforderung und braucht Hosting.
- **Direkter API-Versand an DHL/DPD**: Verworfen für v1 (auf User-Wunsch) — `mailto:` + PDF ist universell und ohne API-Integration nutzbar.
- **`<input type="file" capture>` statt `getUserMedia`**: Letzteres bietet mehr Kontrolle (Vorschau, mehrfache Aufnahme). Wir verwenden `getUserMedia` mit `<input capture>` als Fallback für ältere Browser.

### Offene Fragen

Keine blockierenden Fragen. Alle Architekturentscheidungen wurden vor Plan-Erstellung mit dem User geklärt (volle ADR-Konformität, PWA, PDF + E-Mail, Landbell als Haupt-Entsorger, feingliedrige Chemien-Liste).

**Wartend auf Zulieferung (blockiert nicht v1):**
- Landbell-Dokument (Vorlage/Vordruck) wird der User nach `reference/landbell/` hochladen. Sobald verfügbar, wird `generateBefoerderungspapier` bzw. eine zusätzliche `generateLandbellFormular`-Funktion an das Landbell-Layout angepasst. Bis dahin verwendet die App ein ADR-konformes Standard-Beförderungspapier (nach 5.4.1 ADR).

---

## Schritt-für-Schritt-Aufgaben

### Schritt 1: Projektgerüst initialisieren

Erstelle die App-Verzeichnisstruktur und alle Konfigurationsdateien analog zur `kassenbuch-app`.

**Aktionen:**

- Verzeichnis `akku-logistik-app/` mit Unterordnern `public/`, `src/`, `src/components/`, `src/data/` anlegen.
- `package.json` schreiben — Dependencies: `react`, `react-dom`, `jspdf`. DevDeps wie kassenbuch-app + `@types/jspdf`. Scripts: `dev`, `build`, `lint`, `preview`.
- `index.html`, `vite.config.ts` (mit `base: '/Claude-Code-Workspace/akku-logistik-app/'`), `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, `.oxlintrc.json`, `.gitignore` 1:1 an der kassenbuch-app orientiert anlegen, App-Name angepasst.
- `README.md` mit Hinweis zu ADR-Disclaimer und Setup-Anleitung erstellen.

**Betroffene Dateien:**

- `akku-logistik-app/package.json`
- `akku-logistik-app/index.html`
- `akku-logistik-app/vite.config.ts`
- `akku-logistik-app/tsconfig.json`
- `akku-logistik-app/tsconfig.app.json`
- `akku-logistik-app/tsconfig.node.json`
- `akku-logistik-app/tailwind.config.js`
- `akku-logistik-app/postcss.config.js`
- `akku-logistik-app/.oxlintrc.json`
- `akku-logistik-app/.gitignore`
- `akku-logistik-app/README.md`

---

### Schritt 2: PWA-Assets und Manifest

Erstelle die PWA-relevanten Assets: Manifest, Icons, Service Worker.

**Aktionen:**

- `public/manifest.json` schreiben: Name "Akku-Logistik", short_name "AkkuLog", theme_color `#dc2626` (Warn-Rot für Gefahrgut), display "standalone".
- `public/favicon.svg` als SVG-Akku-Icon (Battery-Symbol mit Warnzeichen).
- `public/icons.svg` als SVG-Sprite mit benötigten UI-Icons: `camera`, `trash`, `plus`, `export`, `mail`, `chevron-left`, `warning`, `check`, `download`.
- `public/sw.js` als Minimal-Service-Worker: Cache-First für statische Assets, Network-First für Daten, Offline-Fallback auf Cache.

**Betroffene Dateien:**

- `akku-logistik-app/public/manifest.json`
- `akku-logistik-app/public/favicon.svg`
- `akku-logistik-app/public/icons.svg`
- `akku-logistik-app/public/sw.js`

---

### Schritt 3: Typsystem und Datenmodell

Definiere die TypeScript-Typen für das gesamte Domänenmodell.

**Aktionen:**

- `src/types.ts` mit folgenden Typen schreiben:
  - `AkkuChemie`: `'lithium-ion' | 'lifepo4' | 'lithium-polymer' | 'lithium-metall' | 'nimh' | 'nicd' | 'blei-gel' | 'blei-saeure' | 'alkaline' | 'zink-kohle' | 'andere'` (LiFePO4 wird separat geführt, weil thermisch stabiler — nutzt aber dieselbe UN-Nummer wie Li-Ion)
  - `AkkuZustand`: `'intakt' | 'gebraucht' | 'defekt' | 'kritisch-defekt'` (kritisch-defekt = brandgefährdet, austretender Elektrolyt, etc.)
  - `AdrUnNummer`: `'UN3480' | 'UN3481' | 'UN3090' | 'UN3091' | 'UN2800' | null`
  - `AdrSv`: `'SV376' | 'SV377' | 'SV188' | null`
  - `AdrVerpackung`: `'P909' | 'P911' | 'LP904' | null`
  - `Akku`: `{ id, datum, foto (base64), hersteller, modell, chemie, zustand, spannung_v, kapazitaet_wh, gewicht_kg, anzahl, seriennr?, bemerkung, adr: { unNummer, sv, verpackung, klasse: '9' } }`
  - `Absender`: `{ firma, strasse, plz, ort, ansprechpartner, telefon, email }`
  - `Empfaenger`: `{ firma, strasse, plz, ort, telefon, email }`
  - `Entsorger`: `{ id, name, firma, adresse: { strasse, plz, ort, land }, email, ansprechpartner, telefon, hinweise, formatVorlage?: 'landbell' | 'standard' }`
  - `Sendung`: `{ id, erstellt, status: 'entwurf' | 'verpackt' | 'versendet', absender, entsorgerId?, akkus: Akku[], abholungWunschdatum?, kundenNr?: string, referenz?: string, bemerkung }` (kundenNr/referenz z.B. für Landbell-Vertragsnummer)
  - `AppData`: `{ sendungen: Sendung[], absenderVorlage?: Absender }`

**Betroffene Dateien:**

- `akku-logistik-app/src/types.ts`

---

### Schritt 4: ADR-Klassifizierungs-Modul

Implementiere die Logik, die aus Chemie + Zustand die korrekte ADR-Klassifizierung ableitet.

**Aktionen:**

- `src/adr.ts` schreiben mit:
  - `klassifiziereAkku(chemie, zustand, inGeraet?)` → liefert `{ unNummer, sv, verpackung }`
    - Lithium-Ion, einzeln, intakt/gebraucht → UN 3480, P903 (oder SV 188 bei kleinen Mengen)
    - Lithium-Ion, in Gerät → UN 3481
    - Lithium-Metall, einzeln → UN 3090
    - Lithium-Metall, in Gerät → UN 3091
    - Defekt → SV 376, P909
    - Kritisch defekt → SV 376, P911 (Spezialverpackung erforderlich)
    - Zur Entsorgung → SV 377 (Sammeltransport unter Bedingungen)
    - Blei → UN 2800 (auslaufsicher) — Klasse 8
  - `getVerpackungsAnweisung(verpackung)` → liefert Text-Block mit konkreten Anforderungen:
    - P909: UN-zertifizierte Verpackung, nicht leitend zwischen den Zellen, nicht-brennbares Füllmaterial (Vermiculit/Sand)
    - P911: UN-zertifizierter dichter Behälter, brand- und druckfest, jeder Akku einzeln gesichert
    - LP904: Großverpackung für mehrere defekte Akkus
  - `getKennzeichnung(unNummer, sv)` → Liste der Etiketten/Kennzeichen für die Versandstücke (Klasse 9A, "BESCHÄDIGTE LITHIUM-IONEN-BATTERIEN" etc.).
  - `validiereSendung(sendung)` → Liste von Warnungen/Fehlern (z.B. "P911 erforderlich, aber Verpackung nicht bestätigt").
- Klare Kommentare mit Quellen-Hinweis (ADR 2025, Kapitel 3.3, SV 376/377).

**Betroffene Dateien:**

- `akku-logistik-app/src/adr.ts`

---

### Schritt 5: Foto-Capture-Modul

Implementiere die Kamerafunktionalität mit Komprimierung.

**Aktionen:**

- `src/photo.ts` schreiben mit:
  - `capturePhoto()`: Öffnet einen `<input type="file" accept="image/*" capture="environment">` programmatisch und gibt ein Promise auf die Datei zurück (universell kompatibel, einfach).
  - `compressImage(file, maxSize = 1280, quality = 0.7)`: Liest die Datei in ein Canvas, skaliert auf max. Längskante, exportiert als JPEG-Base64-String.
  - `getImageSizeKB(base64)`: Hilfsfunktion für Anzeige der gespeicherten Größe.

**Betroffene Dateien:**

- `akku-logistik-app/src/photo.ts`

---

### Schritt 6: Daten-Speicher (Store)

Implementiere `useStore` analog zur kassenbuch-app, erweitert um Sendungen und Akkus.

**Aktionen:**

- `src/store.ts` schreiben mit `useStore`-Hook:
  - `loadData()` / `saveData()` mit Storage-Key `akku-logistik-v1`
  - `createSendung()`, `updateSendung()`, `deleteSendung()`
  - `addAkku(sendungId, akku)`, `updateAkku(sendungId, akku)`, `removeAkku(sendungId, akkuId)`
  - `setAbsenderVorlage(absender)` und `getAbsenderVorlage()` für vorbelegte Absender-Daten
  - `markSendungVersendet(sendungId)`
  - `exportData()` / `importData(json)` für JSON-Backup
  - `getSendungsstatistik(sendungId)` → Gesamtgewicht, Anzahl Akkus, max. Verpackungsstufe

**Betroffene Dateien:**

- `akku-logistik-app/src/store.ts`

---

### Schritt 7: Entsorger-/Spediteur-Stammdaten

Erstelle die Stammdaten mit Landbell Group als vorkonfiguriertem Haupt-Auftragsentsorger.

**Aktionen:**

- `src/data/entsorger.ts` schreiben mit:
  - **Landbell Group** (Standard-Auswahl): Adresse Landbell AG, Rheinstraße 4L, 55116 Mainz. Kontakt-Platzhalter für E-Mail (nachtragbar), Hinweis "Rücknahmesystem für Altbatterien, ADR-konforme Abholung — Landbell-Formular verwenden sobald hinterlegt".
  - **Eigener Entsorger** (leerer Custom-Eintrag)
  - Später optional: weitere (GRS Batterien, Stiftung ear) — für v1 aber nur Landbell + Custom, damit die App fokussiert bleibt.
- Struktur enthält Felder für: Firma, Adresse, Kontakt-E-Mail, Ansprechpartner, Hinweise, optional `formatVorlage` (Kennzeichen für Landbell-spezifisches PDF-Layout, sobald das Dokument in `reference/landbell/` verfügbar ist).
- Kommentar mit Hinweis "TODO: Landbell-Dokument aus reference/landbell/ als Vorlage einbinden, sobald verfügbar".

**Betroffene Dateien:**

- `akku-logistik-app/src/data/entsorger.ts`

---

### Schritt 8: PDF-Generierung

Implementiere die Erstellung der drei PDF-Dokumente mit jsPDF.

**Aktionen:**

- `src/pdf.ts` schreiben mit:
  - `generateInventarliste(sendung)` → A4-Tabelle: Pos, Hersteller, Modell, Chemie, Zustand, Spannung, Wh, kg, Anzahl, ADR-Nr — als PDF-Blob.
  - `generateBefoerderungspapier(sendung)` → ADR-Beförderungspapier nach 5.4.1 ADR mit den Pflichtangaben: UN-Nummer, offizielle Benennung (z.B. "UN 3480 LITHIUM-IONEN-BATTERIEN, 9, (E)"), Klasse 9, Verpackungsgruppe (keine bei Klasse 9), Anzahl/Beschreibung der Versandstücke, Gesamtbruttomasse, Sondervorschrift, Absender-/Empfänger-Vollanschrift.
  - `generatePackliste(sendung)` → Verpackungs-Checkliste: pro Akku Foto + Kennzeichnung der zu verwendenden Verpackung (P909/P911), Hinweise zu Füllmaterial, Etiketten-Übersicht (welche Gefahrzettel pro Versandstück), Konformitätserklärung mit Unterschriften-Feld.
  - `generateAlleDokumente(sendung)` → erstellt alle drei und gibt sie als `{ inventar: Blob, bef: Blob, pack: Blob }` zurück.
  - `downloadPdf(blob, filename)` Hilfsfunktion.

**Betroffene Dateien:**

- `akku-logistik-app/src/pdf.ts`

---

### Schritt 9: UI-Komponenten

Implementiere die React-Komponenten (mobile-first, Tailwind 4).

**Aktionen:**

- `src/components/Uebersicht.tsx` — Liste aller Sendungen mit Status-Chip (Entwurf/Verpackt/Versendet), Tap → SendungView, Floating-Action-Button "Neue Sendung", Header-Buttons Export/Import/Einstellungen.
- `src/components/SendungView.tsx` — Detail einer Sendung: Akku-Liste mit Foto-Thumbnail, ADR-Klassifizierung, Summary-Footer (Gesamtgewicht, Anzahl), Button "Akku hinzufügen", Button "Versand vorbereiten" (öffnet VersandDialog).
- `src/components/AkkuForm.tsx` — Formular mit: Foto-Aufnahme (mit Preview), Hersteller, Modell, Chemie (Dropdown), Zustand (Dropdown mit Warnung bei "kritisch-defekt"), Spannung, Kapazität, Gewicht, Anzahl, Seriennr, Bemerkung. Live-Anzeige der berechneten ADR-Klassifizierung über `AdrInfo`.
- `src/components/AdrInfo.tsx` — Zeigt UN-Nummer + Bezeichnung, Sondervorschrift, Verpackungsanweisung, Etiketten-Symbole; klick → Aufklapp-Box mit Verpackungs-Detailtext.
- `src/components/VersandDialog.tsx` — Entsorger-Auswahl (Dropdown aus `entsorger.ts`, Landbell voreingestellt), Kundennummer/Referenz-Feld für Landbell, Wunschdatum, Validierungs-Warnungen aus `validiereSendung`. Buttons: "PDFs herunterladen" → erstellt alle drei PDFs, lädt sie herunter, öffnet `mailto:`-Link mit vorbefülltem Betreff/Body inkl. Hinweis "Bitte angehängte PDFs prüfen". Status auf "Versendet" markieren.

**Betroffene Dateien:**

- `akku-logistik-app/src/components/Uebersicht.tsx`
- `akku-logistik-app/src/components/SendungView.tsx`
- `akku-logistik-app/src/components/AkkuForm.tsx`
- `akku-logistik-app/src/components/AdrInfo.tsx`
- `akku-logistik-app/src/components/VersandDialog.tsx`

---

### Schritt 10: App-Root und Routing

Implementiere die Hauptkomponente mit View-Router (gleiches Pattern wie kassenbuch-app).

**Aktionen:**

- `src/App.tsx` — `View`-Union: `uebersicht | sendung | akku-form | versand-dialog | einstellungen`. Routing per `useState`, Übergaben analog kassenbuch-app.
- `src/main.tsx` — React-Mount, Service-Worker-Registrierung mit `'serviceWorker' in navigator`-Guard.
- `src/index.css` — Tailwind-Imports (`@import "tailwindcss";`) und globale Resets.

**Betroffene Dateien:**

- `akku-logistik-app/src/App.tsx`
- `akku-logistik-app/src/main.tsx`
- `akku-logistik-app/src/index.css`

---

### Schritt 11: Workspace-Dokumentation aktualisieren

CLAUDE.md erweitern, damit zukünftige Sessions die neue App kennen.

**Aktionen:**

- In `CLAUDE.md` im Abschnitt "Workspace-Struktur" einen Hinweis auf `akku-logistik-app/` und `kassenbuch-app/` als eigenständige PWA-Projekte ergänzen (eigener Abschnitt "Apps").
- Kurzer Abschnitt mit Apps-Übersicht (Name, Zweck, Stack, Pfad).
- Im Bereich "Notizen" Hinweis auf ADR-Disclaimer ergänzen: Die App ist Hilfsmittel, ersetzt keinen Gefahrgutbeauftragten.

**Betroffene Dateien:**

- `CLAUDE.md`

---

### Schritt 12: Build- und Lokalprüfung

Stelle sicher, dass das Projekt baut und lokal lauffähig ist.

**Aktionen:**

- In `akku-logistik-app/` `npm install` ausführen.
- `npm run lint` ausführen, Fehler beheben.
- `npm run build` ausführen, sicherstellen dass TypeScript ohne Fehler durchläuft und Vite ein `dist/`-Verzeichnis erzeugt.
- `npm run dev` starten und manuell prüfen: Übersicht lädt, neue Sendung anlegen, Akku hinzufügen (Foto-Aufnahme mit Test-Bild), ADR-Klassifizierung sichtbar, PDF-Download funktioniert, Mail-Link öffnet sich.
- Build-Output nicht committen (`.gitignore` verhindert das).

**Betroffene Dateien:**

- (nur Validierung, keine Datei-Änderungen)

---

### Schritt 13: Commit und Push

Arbeit auf dem vorgegebenen Branch sichern.

**Aktionen:**

- `git add` der neuen Dateien + `CLAUDE.md` + `plans/2026-06-29-akku-logistik-pwa.md`.
- Commit mit aussagekräftiger Nachricht: `feat(akku-logistik): ADR-konforme PWA für Akku-Erfassung und Versand`.
- Push mit `git push -u origin claude/battery-logistics-app-vhzhwe` (Retry-Logik bei Netzwerkfehlern).
- KEINEN PR erstellen — nur Push (User-Wunsch, vgl. Branch-Richtlinien).

**Betroffene Dateien:**

- Alle neu erstellten und geänderten Dateien werden eingecheckt.

---

## Verbindungen & Abhängigkeiten

### Dateien, die diesen Bereich referenzieren

- `CLAUDE.md` — wird um den App-Eintrag ergänzt.
- Bestehende `kassenbuch-app` ist Pattern-Vorlage, wird aber nicht modifiziert.

### Nötige Updates für Konsistenz

- `CLAUDE.md` Workspace-Struktur muss die neue App und `plans/` widerspiegeln (`plans/` wurde frisch erstellt, ist aber in der Tabelle bereits vorgesehen).
- Falls `context/business-info.md` Absender-Stammdaten für Heikes Firma enthalten soll, wird dies als optionale spätere Erweiterung erwähnt — kein zwingender Schritt für v1.

### Auswirkungen auf bestehende Workflows

- Keine Veränderung an `kassenbuch-app` oder Commands.
- `/prime` lädt CLAUDE.md → erkennt nach Update die neue App automatisch in zukünftigen Sessions.
- Workspace bekommt damit ein zweites parallel laufendes App-Projekt → klare Trennung pro Unterordner, kein Konflikt.

---

## Validierungs-Checkliste

- [ ] Verzeichnis `akku-logistik-app/` existiert mit kompletter Konfiguration
- [ ] `npm install` läuft fehlerfrei durch
- [ ] `npm run lint` zeigt keine Errors
- [ ] `npm run build` produziert `dist/` ohne TypeScript-Fehler
- [ ] `npm run dev` startet einen lokalen Server
- [ ] PWA-Manifest und Service Worker werden vom Build eingebunden
- [ ] Foto-Aufnahme funktioniert (Test mit Mock-Bild)
- [ ] ADR-Klassifizierung ändert sich live, wenn Chemie/Zustand wechselt
- [ ] PDF-Download liefert drei lesbare PDFs (Inventar, Beförderungspapier, Packliste)
- [ ] `mailto:`-Link öffnet sich mit vorbefülltem Betreff und Body
- [ ] localStorage persistiert Sendungen nach Reload
- [ ] JSON-Export/Import funktioniert
- [ ] CLAUDE.md erwähnt die neue App im Workspace-Strukturabschnitt
- [ ] Commit auf Branch `claude/battery-logistics-app-vhzhwe` gepusht
- [ ] Kein PR erstellt (User-Wunsch)

---

## Erfolgskriterien

1. Die PWA lässt sich auf einem Smartphone-Browser installieren und offline öffnen.
2. Ein vollständiger Workflow läuft erfolgreich: Sendung anlegen → mehrere Akkus mit Foto erfassen → ADR-Klassifizierung sehen → PDFs herunterladen → E-Mail-Entwurf an Spediteur öffnen.
3. Die generierten PDFs enthalten alle pflichtgemäßen ADR-Angaben (UN-Nummer, Klasse 9, Sondervorschrift, Verpackungshinweis, Absender/Empfänger, Gesamtmasse).
4. Der Code folgt dem gleichen Stil und der gleichen Architektur wie die `kassenbuch-app` (View-Router, `useStore`, Tailwind 4, TypeScript strict).
5. CLAUDE.md ist aktualisiert, sodass `/prime` in der nächsten Session die App findet.

---

## Notizen

- **ADR-Disclaimer**: Die App ist ein Hilfswerkzeug zur strukturierten Erfassung und Dokumentation. Sie ersetzt nicht den Gefahrgutbeauftragten (ADR Kap. 1.8.3) oder eine ADR-Schulung. Im README und sichtbar in den Einstellungen aufnehmen.
- **Mögliche v2-Erweiterungen** (nicht Teil dieses Plans):
  - IndexedDB-Migration für größere Fotomengen
  - Direkte Spediteur-API-Anbindung (DHL, DPD)
  - Cloud-Sync zwischen mehreren Geräten
  - Mehrere Absender/Standorte verwalten
  - Druck-optimierte Etiketten (UN-Etikett, Klasse-9-Etikett) generieren
  - QR-Code auf der Verpackung zur Sendungs-Verfolgung
- **Datenschutz**: Daten verbleiben lokal im Browser. Beim Versand-PDF werden Daten an den Spediteur weitergegeben — Standardgeschäftsdatenschutz, kein DSGVO-Sonderfall.
- **Browser-Kompatibilität**: PWA-Installation auf iOS Safari etwas eingeschränkter als Android Chrome, Funktionalität läuft aber überall. Kamera-Capture über `<input capture>` ist universell unterstützt.
- **Testdaten**: Beispiel-Sendung mit 2–3 Akkus könnte im Store als Demo-Daten beim Erststart angeboten werden — bewusst weggelassen, damit kein Datenmüll entsteht. User kann nach dem ersten Login direkt produktiv loslegen.

---

## Implementierungsnotizen

**Implementiert:** 2026-08-14

### Zusammenfassung

- Vollständige PWA `akku-logistik-app/` angelegt (React 19, Vite 8, TypeScript, Tailwind 4, jsPDF).
- Datenmodell mit feingliedriger Chemien-Liste (Li-Ion, LiFePO4, Li-Polymer, Li-Metall, NiMH, NiCd, Blei-Gel, Blei-Säure, Alkaline, Zink-Kohle).
- ADR-Klassifizierungs-Modul mit UN 3480/3481/3090/3091/2800, SV 188/376/377, Verpackungsanweisungen P801/P903/P909/P911/LP904.
- Landbell Group als vorkonfigurierter Standard-Entsorger, "Eigener Entsorger" als Custom-Slot.
- Foto-Capture per Kamera + Komprimierung auf 1280 px / JPEG-Q0.7 als Base64.
- Store mit localStorage, JSON-Export/Import.
- PDF-Generierung: Inventarliste, ADR-Beförderungspapier (5.4.1), Packliste/Konformitätscheckliste.
- VersandDialog mit Validierung, PDF-Download, `mailto:`-Öffnung.
- Service Worker für Offline-Betrieb.
- Build (`npm run build`) und Lint (`npm run lint`) grün.
- CLAUDE.md um "Apps im Workspace" erweitert.
- `reference/landbell/` als Ablage für den Landbell-Vordruck angelegt.

### Abweichungen vom Plan

- Verpackungsanweisung P801 (Blei-Batterien) wurde zusätzlich in `AdrVerpackung` aufgenommen — im Plan nicht namentlich erwähnt, aber notwendig, sobald Blei-Batterien in der Chemie-Auswahl auftauchen.
- Vite-Base-Pfad ist bereits gesetzt, GitHub-Pages-Deployment (analog kassenbuch-app) wurde nicht mit ausgeführt — das ist ein separater Schritt, wenn die App online gestellt werden soll.

### Aufgetretene Probleme

- Einmaliger TypeScript-Fehler bei P801 (nicht im Typ enthalten) → gefixt durch Typ-Erweiterung + Verpackungsanweisungstext.

### Offene Nachschritte (aus User-Zulieferung)

- Landbell-Formular in `reference/landbell/` hinterlegen → PDF-Layout entsprechend anpassen (`pdf.ts`, verzweigt auf `entsorger.formatVorlage === 'landbell'`).
- Optional: GitHub-Pages-Workflow für die App analog `docs/`-Pattern der kassenbuch-app.
