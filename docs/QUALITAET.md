# Prüfprotokoll

Stand: 19.10.2026. Tatsächlich ausgeführte technische Prüfungen; keine Testabdeckungsquote und kein Beleg für empirischen Lernerfolg. Die externe Quellenprüfung stammt weiterhin vom 18.10.; die Prüfungen der geänderten Implementierung werden am 19.10. erneut ausgeführt.

| Prüfung | Ergebnis |
| --- | --- |
| `npm run check` | 35 Dateien, keine Fehler, Warnungen oder Hinweise |
| `npm test` | 56 erfolgreiche Verhaltenstests und Graphprüfungen |
| Java-Lehrausschnitt: `mvn verify` | 30 erfolgreiche Tests, ausführbare JAR erzeugt |
| Angepasste vollständige PetClinic: gezielter Maven-Lauf | 45 erfolgreiche Tests, darunter vier neue Integrationsfälle und ursprüngliche Webcontroller |
| `npm run build` | 18 HTML-Seiten, Sitemap, 13 Markdown-Endpunkte, zwei Java-Quellcodearchive |
| `npm run verify` | Neun Java-Ausschnitte mit Quelldateien abgeglichen; 709 lokale Links/Assets einschliesslich Anker und Downloads erfolgreich geprüft |
| `npm run test:browser` | Neun erfolgreiche Prüffälle in drei Browserkonfigurationen |
| `npm run verify:sources` | Sechs ausgewählte Quelldateien an vier festen Commits erreichbar; geprüfte Textmerkmale bestätigt |

## Umfang

Die TypeScript-Tests prüfen alle vier Architekturen auf Erfolg, korrektes Pet, wiederholte Visits, ungültige/heutige/vergangene Daten, leere Beschreibungen, 255/256-Zeichen-Grenze und fehlende oder nicht passende Fachobjekte. Graphprüfungen trennen Aufrufe von statischen Abhängigkeiten; Interfaces dürfen keine Laufzeitstationen sein.

Die 30 Java-Tests umfassen 20 parameterisierte HTTP-/H2-Szenarien, vier ArchUnit-Strukturtests und sechs parameterisierte Ausführungen ohne Framework. Letztere prüfen Clean, Hexagonal und Onion mit einem Ersatzspeicher: gültiger Besuch für das ausgewählte Pet sowie heutiges Datum ohne Speicheraufruf oder Zustandsänderung. Insbesondere wird in den HTTP-Tests ein Datenbankfehler nach dem Löschen bestehender Visit-Zeilen erzwungen: Die Transaktion muss den ursprünglichen Datenbestand wiederherstellen. Eine feste Uhr macht Datumsprüfungen reproduzierbar. ArchUnit kontrolliert den frameworkfreien Kern, technische Abhängigkeiten innerer Anwendungsbereiche und die Trennung der Varianten. Die isolierten Tests allein belegen kein Datenbank-Rollback.

Die vier neuen Integrationsfälle der vollständigen PetClinic speichern je einen Visit durch Layered, Clean, Hexagonal und Onion in die vorhandene Datenbank. Danach muss er auf der originalen, serverseitig gerenderten Owner-Detailseite erscheinen. Zusammen mit ursprünglichen Owner-, Pet-, Visit-, Vet- und Welcome-Webcontrollertests bestehen 45 Tests:

```sh
mvn -Dtest=ArchitectureIntegrationTest,VisitControllerTests,OwnerControllerTests,PetControllerTests,VetControllerTests,WelcomeControllerTests test
```

Dies ist kein Lauf aller Docker-/Datenbankvarianten der ursprünglichen PetClinic.

Playwright prüft Chromium Desktop (1280 px), Chromium mit Pixel-7-Emulation sowie Firefox Desktop. Jede Konfiguration besucht alle 17 regulären Inhaltsseiten, kontrolliert Skriptfehler, horizontalen Seitenüberlauf und axe-core-Regeln mit WCAG-2-A-/AA- und 2.1-AA-Tags. Zusätzlich: Suche, Escape, Navigation, lokaler Lesefortschritt, Quiz, Tastatursteuerung und alle vier Explorer-Modi mit gültigen und ungültigen Besuchen. Screenshots von Startseite, Clean-Kapitel und Explorer wurden zur Sichtprüfung erzeugt.

Die Browserinteraktion prüft zusätzlich das Öffnen der Transferlösung und die Verknüpfung zum frameworkfreien Kerntest. Der erste Lauf vom 19.10. wurde durch einen versehentlich überlappenden Neubau gestört: acht Prüffälle erfolgreich, ein Firefox-Aufruf mit vorübergehendem HTTP 404. Im abschliessenden Lauf nach dem Neubau sind alle neun Prüffälle erfolgreich. Das war ein Fehler im Prüfablauf, kein als Nutzerbefund ausgegebener Websitefehler.

Der Hauptbericht wurde in seiner vorhandenen Gliederung aktualisiert und mit Word gerendert; alle 19 Seiten wurden als PNG visuell geprüft. Der mitgelieferte LibreOffice-Renderer bleibt mangels `soffice.exe` nicht ausführbar. Die tatsächliche Ersatzprüfung erfolgt über Word-PDF und Poppler. Überschriftenhierarchie und zwei Dokumentabschnitte sind erhalten.

## Gefundene und behobene Fehler

- Kontraste einzelner Syntaxfarben: schwarze Codebeispiele auf hellem Hintergrund; auch Markdown nutzt ein helles Theme.
- Scrollbare Tabellen/Code ohne sicheren Tastaturzugang: fokussierbare Scrollbereiche ergänzt.
- Escape leerte zunächst teilweise nur das Suchfeld: explizite Dialogbehandlung ergänzt.
- Auf Mobilgeräten zu klein skalierte Diagramme: fokussierbare Scrollbereiche mit lesbarer Mindestbreite.
- Gleichnamige Spring-Controller: explizite Bean-Namen vergeben.
- JSON-Bindung bei anderem Jackson-Stand: Transport-Datentyp für Datum/Beschreibung; Route-IDs werden erst im Command übernommen.
- Erweiterung überlud MVC-Test-Slices: passende Komponentensuche und auf neue APIs begrenzte Fehlerbehandlung.

## Grenzen

Keine externe Zielgruppenstudie durchgeführt. `evaluation/USABILITY.md` enthält ein vorbereitetes Protokoll ohne fingierte Resultate. Keine empirische Wartbarkeits- oder Lernerfolgsmessung.

axe-Prüfungen sind kein vollständiger WCAG-Konformitätsnachweis. Reale Touchgeräte, manuelle Screenreader-Nutzung und weitere Browser bleiben separat zu prüfen. Mobile Browserprüfung ist eine Emulation.

Die Java-Beispiele sind lokale Lehranwendungen ohne Authentisierung oder Schutz vor konkurrierenden Änderungen. Die vollständige PetClinic erhält vier alternative Visit-Wege; ihre übrigen Funktionen werden nicht als vollständig Clean/Hexagonal/Onion-konform ausgegeben. Der separate Lehrausschnitt verwendet eine H2-Datei, die vollständige PetClinic ihre ursprüngliche standardmässige In-Memory-Datenbank.

## Reproduktion

Im Verzeichnis `whole-wavelength`: `npm ci`, `npm run check`, `npm test`, `npm run build`, `npm run verify`. Für Browsertests zunächst `npx playwright install chromium firefox`, danach `npm run test:browser`. Java 21 und Maven 3.9+ für die Java-Projekte verwenden; Start und Tests stehen in deren README bzw. `ARCHITECTURE-CHANGES.md`.

GitHub Actions enthält Website-/Browserprüfungen vor dem Pages-Deployment und einen separaten Java-Prüfworkflow.
