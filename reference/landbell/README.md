# Landbell Group / DS Entsorgungs-GmbH — Referenz

Ablage für Original-Korrespondenz mit dem Auftragsentsorger.

## Wichtig: Struktur der Landbell Group

- **DS Entsorgungs- und Dienstleistungs-GmbH** — operative Abwicklung
  (Batterie-Rücknahme, Abholung, Sortierung). Tochter der Landbell Group.
- **Landbell GmbH** — Rechnungsstellung im Konzern.

Beide Firmen sitzen unter derselben Adresse:
Rheinstraße 4 L · 55116 Mainz.

## Kontaktdaten (extrahiert aus Korrespondenz Q2/2023)

### DS Entsorgungs-GmbH (operativ)
- E-Mail: `batteriesammlung.de@ds-entsorgungs-gmbh.de`
- Web: https://www.ds-entsorgungs-gmbh.de
- Telefon: +49 241 95 15 2000
- Ansprechpartnerin: **Sabine Ey** — Sales Service Specialist Battery Recycling
- HRB 47080 Mainz · GF: Ellen Hitschler, Uwe Echteler

### Landbell GmbH (Rechnungsstelle)
- Telefon: +49 6131 235652-0
- Fax: +49 6131 235652-10
- HRB 7123 Mainz · USt-ID: DE205246700
- GF: Tim Scholz, Uwe Echteler

## Kunden-Stammdaten TU Dresden (Beispiel)
- Kd.-Nr. bei Landbell: **53129** (Rechnungen tragen teils 53128 im Dateinamen)
- Bestellnummer-Schema: `YYYY-Q-AB-N` (z. B. `2023-2Q-AB-1`)
- Auftragsnummer-Schema: `NNN/YYYY` (z. B. `126/2023`)
- KST: **95404722G** (bzw. gekürzt 954047 auf Rechnungen)
- Rechnungsempfänger: TU Dresden / zentraler Rechnungseingang, 01062 Dresden
- USt-ID TU Dresden: DE188369991

## Service-Positionen (aus Rechnung 90788521, 17.07.2023)
| Pos | Bezeichnung | Preis | PE |
| --- | --- | --- | --- |
| 10 | Pauschalpreis Logistik Auslieferung / Abholung Paloxe | 180,00 EUR | Stück |
| 20 | Abholung Industriebatterien / Tonnage | 3.800,00 EUR | Tonne (PE=4 = pro 1000 kg) |

Umsatzsteuer: 19 %.

## Anhänge in E-Mails (Beispiel Q2/2023)
- Rechnung Standortabholung (PDF, s. `90788521_Landbell_Rechnung_TU-Dresden_Q2-2023.pdf`)
- **Sortierprotokoll** (XLSX) — operatives Dokumentationsformat, das die
  App eines Tages replizieren könnte, wenn ein Muster vorliegt.

## Dateien in diesem Ordner
- `90788521_Landbell_Rechnung_TU-Dresden_Q2-2023.pdf` — Muster-Rechnung
- `DS-Entsorgung_Anschreiben_Q2-2023.msg` — Original-E-Mail mit Anschreiben
- Sortierprotokoll XLSX — **fehlt noch**, wenn vorhanden hier ablegen.

## Nächste Schritte für die App
- Absender-Vorlage TU Dresden ist im Store bereits voreingestellt.
- `mailto:`-Empfänger wird für die DS Entsorgungs-GmbH voreingestellt.
- Sobald ein Sortierprotokoll (XLSX) vorliegt, kann `pdf.ts` um eine
  `generateSortierprotokoll()`-Funktion erweitert werden.
