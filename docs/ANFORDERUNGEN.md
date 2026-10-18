# Anforderungen und Nachweise

Stand 18.10.2026. Diese Matrix dokumentiert den tatsächlich vorhandenen Stand. Sie ersetzt keine rückwirkenden Issues oder Betreuungsfreigaben.

| ID | Anforderung | Artefakt und Akzeptanzkriterium | Stand |
| --- | --- | --- | --- |
| F01 | System- und Codeebene unterscheiden | Grundlagenkapitel, Einführungen und Vergleich definieren die Perspektiven und deren Kombinierbarkeit | Umgesetzt |
| F02 | PetClinic als gemeinsames Beispiel | Fachobjekte und originaler Visit mit festem Referenzcommit, kein erfundener Vet im Baseline-Visit | Umgesetzt |
| F03 | Monolith/Modulith, Microservices, SCS/ISA | Vier Lernseiten mit Diagrammen; SCS als eigener Entwurf; Quellen zu Community-Varianten | Umgesetzt |
| F04 | Clean, Hexagonal und Onion im Schwerpunkt | Drei Lernseiten, Java-Varianten, Vergleich und Explorer; Layered als Referenz | Umgesetzt |
| F05 | Gemeinsamer Use-Case | Vier Varianten mit gleichen Regeln und denselben Erfolg-/Fehlerszenarien getestet | Umgesetzt |
| F06 | Angepasste Spring PetClinic bereitstellen | Vollständige gepinnte PetClinic mit zusätzlichen vier Visit-Wegen, Datenbank-/Detailseiten-Integration und Quellcodearchiv | Umgesetzt; Integration und ursprüngliche Webcontroller geprüft |
| F07 | Interaktiver Architekturvergleich | Vier Modi, zwei Pfeilarten, Bausteindetails, tatsächlicher Ausführungstrace | Umgesetzt, Browsertests vorhanden |
| F08 | Inhalte als Markdown | Alle 13 Kapitel als Download, im Produktionsbuild verlinkt | Umgesetzt |
| Q01 | Begründete Technologiewahl | Astro/Vanilla, CSS-Alternativen, React-Abwägung und Hosting im Konzept/Bericht | Dokumentiert |
| Q02 | Lesbare, mobile Website | 18-px-Systemschrift, reduzierte Startseite, Kontrast-/Overflow-/Interaktionstests | Automatisiert geprüft; reale Geräte offen |
| Q03 | Nachvollziehbare Quellen | Primärquellen, vier feste Repo-Commits, gezielter Quellencheck | Umgesetzt |
| Q04 | Reproduzierbare technische Tests | npm-Skripte, Playwright/axe, Maven/ArchUnit, dokumentierte Grenzen | Umgesetzt |
| Q05 | Zielgruppen-Evaluation | Vorbereitetes Aufgabenprotokoll, tatsächliche Durchführung und Verbesserungen | Offen; keine Ergebnisse erfunden |
| P01 | Gantt, Protokolle, Feedback und DoD | Ursprüngliche Unterlagen bleiben unverändert; zukünftige Rückmeldungen tatsächlich dokumentieren | Laufender Prozess |
| P02 | Bericht | Bestehende Word-Gliederung beibehalten, Theorie/Methoden/Resultate/Diskussion/Quellen/Anhang ausformuliert | Inhalt ausgearbeitet; Autorenprüfung nötig |
| P03 | KI transparent ausweisen | Anhang beschreibt umfangreiche KI-Unterstützung, keine falschen Studien/Erfahrungen | Dokumentiert; Hochschulvorgaben abgleichen |
| P04 | Dezember-Meilensteine | Zwischenstand 01.12., Abschluss Site bis 11.12., Demo 16.12., Abgabe 18.12. | Zukünftig |

## Definition of Done für weitere Änderungen

Vor der Umsetzung: konkretes Problem und 3–6 überprüfbare Akzeptanzkriterien festlegen. Nach Umsetzung: fachliche Quelle bzw. Sollverhalten prüfen, passende automatisierte Tests ausführen, betroffene Seiten im Browser sichten und Dokumentation aktualisieren. Ein Review mit Betreuungsfeedback darf erst als erledigt gelten, wenn es tatsächlich stattgefunden hat.

## Noch notwendige externe Schritte

1. Tatsächliches Betreuungsfeedback zum fertig implementierten Visit-Vergleich dokumentieren und bei Bedarf einarbeiten.
2. Zwei bis drei reale Personen bearbeiten die Aufgaben aus `evaluation/USABILITY.md`; Beobachtungen werden unverändert erfasst und ausgewertet.
3. Autor prüft und verantwortet den gesamten Bericht, ergänzt tatsächliche spätere Projektarbeit und die verbindliche KI-Deklaration.
4. Veröffentlichung und Abgabepaket werden vor der Einreichung gegen den finalen Quellstand geprüft.
