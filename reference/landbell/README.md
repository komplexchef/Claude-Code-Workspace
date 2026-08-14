# Landbell Group / DS Entsorgungs-GmbH — Referenz

Ablage für Original-Korrespondenz, Vorlagen und Stammdatenblätter des
Auftragsentsorgers.

## Struktur der Landbell Group

- **DS Entsorgungs- und Dienstleistungs-GmbH** — operative Abwicklung
  (Batterie-Rücknahme, Abholung, Sortierung). Tochter der Landbell Group.
- **Landbell GmbH** — Rechnungsstellung im Konzern.

Beide unter derselben Adresse: Rheinstraße 4 L, 55116 Mainz.

## Kontakte (aus Korrespondenz Q2/2023)

### DS Entsorgungs-GmbH (operativ)
- E-Mail: `batteriesammlung.de@ds-entsorgungs-gmbh.de`
- Web: https://www.ds-entsorgungs-gmbh.de
- Telefon: +49 241 95 15 2000
- Ansprechpartnerin: **Sabine Ey** — Sales Service Specialist Battery Recycling
- HRB 47080 Mainz · GF: Ellen Hitschler, Uwe Echteler

### Landbell GmbH (Rechnungsstelle)
- Telefon: +49 6131 235652-0 · Fax: -10
- HRB 7123 Mainz · USt-ID: DE205246700
- GF: Tim Scholz, Uwe Echteler

## Kunden-Stammdaten TU Dresden (aus Kundenstammdatenblatt 12/2021)

| Feld | Wert |
| --- | --- |
| Firma | TU Dresden |
| USt-Nr. | 161/107/13162 |
| USt-ID | DE188369991 |
| **Abholstelle** | **Fuhrpark, 01217 Dresden** |
| Rechnungsanschrift | Zentraler Rechnungseingang, 01062 Dresden |
| KST | 9540472G (auf Rechnung 90788521 als 95404722G verzeichnet) |
| Kd.-Nr. bei Landbell | 53129 (Dateiname zeigt teils 53128) |
| Telefon | 0351 46333627 |
| Hauptansprechpartner | **Herr Hennig** — Gefahrgut- und Gewässerschutzbeauftragter |
| E-Mail | rene.hennig@tu-dresden.de |
| Rechnungseingang | zentraler.rechnungseingang@tu-dresden.de (cc rene.hennig@tu-dresden.de) |
| Bank | Commerzbank · IBAN DE52 8504 0000 0800 4004 00 · BIC COBADEFF850 |

## Verpackung (Dolav-Paloxe, DS/Landbell-Standard)

Paloxen sind speziell für Lithium-Batterien: Kunststoff-Verkleidung,
Metall-Grundgerüst. Verpackungsregeln:

- Alle Pole **vorher abkleben**.
- Akkus **einzeln mit Abstand** einlegen (Pole nie berühren).
- Nicht direkt auf den Boden — komplett in **Vermiculit** einbetten
  (oben, unten, links, rechts).
- Zwischenräume ebenfalls mit Vermiculit verfüllen.
- Mehrere Schichten übereinander erlaubt.
- **KEINE transportkritischen** Akkus einlegen (ADR SV 376):
  keine Ausgasung, nicht aufgebläht, nicht deformiert, nicht äußerlich
  beschädigt. Im Zweifel Sachverständigen einbinden.

## Kennzeichnungslabel (DS-Vorlage)

Standardisiertes Label für die Sammelbehälter:
- Titel: „LITHIUMBATTERIEN ZUM RECYCLING"
- UN 3090 und UN 3480 sichtbar
- Zusatz: „Batterien / Akkus Sammelbehälter"
- „Batterierücknahme der DS Entsorgungs- und Dienstleistungs-GmbH"
- Kontakt: batteriesammlung.de@DS-Entsorgungs-Gmbh.de
- Gefahrzettel Klasse 9A rechts

Die App-Funktion `generateKennzeichnungslabel()` erzeugt dieses Label
automatisch als druckbare A5-PDF (siehe `akku-logistik-app/src/pdf.ts`).

## Service-Positionen (aus Rechnung 90788521)

| Pos | Bezeichnung | Preis | PE |
| --- | --- | --- | --- |
| 10 | Pauschalpreis Logistik / Abholung Paloxe | 180,00 EUR | Stück |
| 20 | Abholung Industriebatterien / Tonnage | 3.800,00 EUR | Tonne (PE=4) |

USt: 19 %.

## Dateien in diesem Ordner

- `90788521_Landbell_Rechnung_TU-Dresden_Q2-2023.pdf` — Muster-Rechnung
- `DS-Entsorgung_Anschreiben_Q2-2023.msg` — Original-E-Mail
- `DS_Kennzeichnungslabel.pdf` — Original-Label-Vorlage der DS
- `DS_Dolav-Paloxen_Verpackungsanleitung.pdf` — offizielle Paloxe-Anleitung
- `Landbell_Kundenstammdatenblatt_TU-Dresden_2021.xlsx` — Kundenstammdaten

## Noch offen

- **Sortierprotokoll (XLSX)** — operatives Doku-Format, das der Sendung
  beigelegt wird. Sobald ein Muster vorliegt, kann die App eine
  `generateSortierprotokoll()`-Funktion ergänzen.
