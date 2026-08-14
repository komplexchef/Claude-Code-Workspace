# Akku-Logistik &mdash; ADR-konforme Erfassung defekter Akkus

Mobile PWA zur Erfassung, Klassifizierung und dokumentierten Übergabe defekter
Lithium- und anderer Batterien an einen Auftragsentsorger (vorkonfiguriert:
**Landbell Group**).

## Kernfunktionen

- Foto-Erfassung defekter Akkus direkt aus dem Browser (Kamera oder Galerie)
- Feingliedrige Chemien-Auswahl (Li-Ion, LiFePO4, Li-Polymer, Li-Metall,
  NiMH, NiCd, Blei-Gel, Blei-Säure, Alkaline, Zink-Kohle)
- Automatische ADR-Klassifizierung (UN 3480/3481/3090/3091/2800,
  Sondervorschriften SV 376/377, Verpackungsanweisungen P909/P911/LP904)
- Sendungen bündeln beliebig viele Akkus
- PDF-Generierung: Inventarliste, ADR-Beförderungspapier, Packliste
- E-Mail-Versand an Entsorger via `mailto:` (PDFs werden lokal heruntergeladen
  und manuell angehängt)
- Offline-fähig durch Service Worker
- Alle Daten bleiben lokal (localStorage), JSON-Export/Import zur Sicherung

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## ADR-Disclaimer

Diese App ist ein Hilfswerkzeug zur strukturierten Erfassung und Dokumentation
von Batterie-Sendungen. Sie **ersetzt nicht** den Gefahrgutbeauftragten nach
ADR Kapitel 1.8.3 oder eine ADR-Schulung. Für den tatsächlichen Versand sind
die aktuell geltenden Vorschriften (ADR/RID/IMDG) und die Vorgaben des
gewählten Entsorgers verbindlich.

## Landbell-Formular

Der Auftragsentsorger Landbell Group verwendet ein eigenes Formular. Sobald
dieses in `../reference/landbell/` hinterlegt ist, wird das PDF-Layout
entsprechend angepasst.
