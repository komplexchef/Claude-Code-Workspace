# Landbell Group — Vordrucke

Ablage für Original-Formulare und Vordrucke der Landbell Group
(Rücknahmesystem für Altbatterien).

Sobald hier ein Landbell-Vordruck liegt, wird `akku-logistik-app/src/pdf.ts`
angepasst, damit die generierten Beförderungspapiere dem Landbell-Layout
entsprechen (verzweigt über `entsorger.formatVorlage === 'landbell'`).

## Erwartete Dateien

- Landbell-Formular (PDF oder Bild) — Vorlage für das Beförderungspapier
- Ggf. Preisliste / Kundennummer-Zuordnung
- Kontakt-E-Mail-Adresse und Ansprechpartner
