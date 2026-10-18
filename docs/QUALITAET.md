# Prüfprotokoll

## Automatisierte Prüfungen – 18.10.2026

| Prüfung | Ergebnis |
| --- | --- |
| `npm run check` | 27 Dateien, 0 Fehler, 0 Warnungen, 0 Hinweise |
| `npm test` | 48 Tests erfolgreich |
| `npm run build` | 18 HTML-Seiten plus Sitemap erfolgreich erzeugt |
| `npm run verify` | 787 interne Link-/Asset-Verweise, alle lokalen Anker, Quizoptionen und Sitemap-Einträge geprüft |
| Lokaler HTTP-Smoke-Test | Startseite, Explorer, Quellen, Code, Clean-Kapitel, Vergleich und Sitemap antworten mit HTTP 200 |
| `git diff --check` | Keine Whitespace-Fehler |
| npm-Installation | Audit meldet 0 bekannte Schwachstellen zum Installationszeitpunkt |

Die fachlichen Tests prüfen alle vier ausführbaren Varianten: erfolgreicher Visit, korrektes Pet, wiederholte Visits, heutiges/vergangenes/unmögliches/ungültiges Datum, leere/überlange Beschreibung, fehlender Owner, nicht zugehöriges Pet und unveränderte Persistenz bei Fehlern. Graphprüfungen kontrollieren Referenzen und insbesondere die Umkehr der Code-Abhängigkeit am Persistenzvertrag.

Der statische Build-Test kontrolliert genau ein H1 pro Seite, deutsche Sprachkennzeichnung, Meta-Beschreibung, Main-Landmark, eindeutige IDs, vorhandene interne Ziele und keine Platzhalterlinks. Er prüft auch den GitHub-Pages-Basispfad `/projektarbeit-test`.

## Umgesetzte Accessibility-Massnahmen

Semantische Bereiche, Skip-Link, sichtbare Fokusmarkierung, native Buttons und Formulare, beschriftete Eingaben, Tastatursteuerung der Architektur-Tabs, per Tastatur auswählbare SVG-Komponenten, Statusmeldungen, reduzierte Animation bei entsprechender Systemeinstellung und eine Druckansicht. Schriftfarben der kleinen Labels wurden für besseren Kontrast angepasst. Die Navigation wird unter 800 px als aufklappbares Menü angeboten; Formulare und Detailbereiche werden auf schmalen Displays untereinander angeordnet.

Diese Massnahmen sind keine Behauptung einer formell nachgewiesenen WCAG-Konformität.

## Grenzen der Prüfung

Die Browserinventur der verbundenen Computer-Use-Umgebung lieferte keine Browser. Auch das Öffnen eines In-App-Browser-Tabs meldete „Browser is not available: iab“. Deshalb wurden keine visuelle Browserprüfung, kein realer Touch-/Screenreader-Test und keine automatisierten End-to-End-Klicktests durchgeführt. Responsive CSS, Tastaturlogik und ARIA-Attribute wurden implementiert und im Quelltext geprüft; eine manuelle Sichtprüfung bleibt als separater Nachweis offen.

Keine Nutzerstudie mit externen Personen durchgeführt. Keine empirischen Wartbarkeitsmessungen. Quellenlinks und Repository-Hauptbranches sind keine festgeschriebenen wissenschaftlichen Snapshots.

## Reproduzieren

Im Verzeichnis `whole-wavelength`:

```powershell
npm ci
npm run check
npm test
npm run build
npm run verify
```

Der Pages-Workflow führt diese Qualitätsprüfungen vor dem Deployment aus.
