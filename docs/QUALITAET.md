# Prüfprotokoll

## Fachliche Überarbeitung nach Quellenabgleich

Die vier Einstiegsseiten wurden verständlicher aufgebaut und um Qualitätsziele, Randbedingungen, Zielgruppe und die didaktische Begrenzung der beiden Architekturebenen ergänzt. „Besuch erfassen“ ist der fachliche Hauptbegriff. Der kanonische Ablauf enthält keine Vet-Zuordnung; die reale Modulith-Variante ergänzt diese per Event. SCS und Microservices werden als überschneidende Konzepte erklärt; Layered wird nicht auf konkrete Repository-Klassen eingeschränkt.

Das Visit-Diagramm zeigt Controller-Zugriffe auf Fachmodell und Repository getrennt. Ports sind im Explorer Verträge ohne eigene Laufzeitausführung. Nur die Codeansicht zeigt Abhängigkeiten auf diese Interfaces. Ausführbare Varianten nutzen benannte äussere Adapter. Die Beschreibung ist auf 255 Zeichen begrenzt, Demo-spezifische Vereinfachungen sind dokumentiert.

Prüfstand: 56 erfolgreiche Tests einschliesslich 255/256-Zeichen-Grenze und Graph-/Trace-Prüfung ohne ausführende Interfaces. TypeScript/Astro: 30 Dateien, keine Fehler, Warnungen oder Hinweise. Produktionsbuild: 18 HTML-Seiten. Statische Prüfung: 680 lokale Verweise, Anker, Quizoptionen, Metadaten und Sitemap erfolgreich geprüft.

`npm run verify:sources` wurde erfolgreich online ausgeführt. Sechs ausgewählte Quelldateien an vier festen Repository-Commits antworteten mit HTTP 200 und erfüllten die geprüften fachlichen Aussagen. Die konkreten Commits stehen in `src/data/source-snapshots.ts` und im Quellenbereich. Dies ist ein gezielter Beleg für die behandelten Aussagen, kein vollständiger Audit der Repositories. Die unten dokumentierte Grenze der visuellen Browserprüfung gilt weiterhin.

## Designvereinfachung nach Nutzerfeedback

Die Startseite wurde auf Einleitung und Lernpfad reduziert. Weisse Flächen, schwarze Lerntexte, lokale Systemschriften und blaue Akzente ersetzen die ursprüngliche Gestaltung. Lerntexte verwenden 18 Pixel. Das rechte Inhaltsverzeichnis und die Lesezeitanzeige sind entfernt. Lerninhalte und Interaktionslogik bleiben unverändert.

Erneut geprüft: TypeScript/Astro ohne Fehler, Warnungen oder Hinweise; Produktionsbuild mit 18 HTML-Seiten; 680 lokale Links und Asset-Verweise samt Ankern erfolgreich geprüft. Zusätzlich wurde am erzeugten HTML kontrolliert, dass die entfernten Startseitenblöcke, das Inhaltsverzeichnis und die Lesezeit nicht mehr ausgegeben werden. Keine externen Webfonts mehr vorhanden. Die unten dokumentierte Einschränkung der visuellen Browserprüfung gilt weiterhin.

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

Keine Nutzerstudie mit externen Personen durchgeführt. Keine empirischen Wartbarkeitsmessungen. Die PetClinic-Repository-Referenzen wurden im Zuge der fachlichen Überarbeitung auf dokumentierte Commits festgelegt; externe Architekturartikel und Framework-Dokumentationen sind weiterhin veränderliche Webquellen.

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
