# Architektur Atelier

Deutschsprachige Lern-Microsite zur Softwarearchitektur. Spring PetClinic ist das gemeinsame Beispiel; auf der Codeebene bleibt der Use-Case «Visit für ein Pet erfassen» konstant.

## Lokal starten

Voraussetzung: Node.js 24 (mindestens 22.22), npm.

```powershell
cd whole-wavelength
npm ci
npm run dev -- --background
```

Astro nennt die lokale URL. Wegen GitHub Pages beginnt der Pfad mit `/projektarbeit-test/` (typischerweise `http://localhost:4321/projektarbeit-test/`). Hintergrundserver: `npm run astro -- dev status`, `npm run astro -- dev logs`, `npm run astro -- dev stop`.

## Prüfen und bauen

```powershell
npm run check
npm test
npm run build
npm run verify
```

`check` prüft TypeScript und Astro-Komponenten. Die Tests prüfen das fachliche Verhalten aller vier Architekturvarianten und die Diagrammmodelle. `verify` prüft nach dem Build alle lokalen Links, Assets, Anker, Seitenmetadaten, Quizoptionen und die Sitemap.

## Aufbau

- `src/content/lernen/`: 13 Markdown-Lernkapitel, gegliedert nach Grundlagen, PetClinic, System- und Codeebene.
- `src/content.config.ts`: validiertes Schema für Inhalte und Verständnisfragen.
- `src/data/site.ts`: Lernpfad, Quellen und zentrale URL-Funktion für den Pages-Basispfad.
- `src/data/source-snapshots.ts`: dokumentierte Commit-Stände der vier PetClinic-Referenzprojekte.
- `src/data/explorer.ts`: Komponenten und getrennte Aufruf-/Abhängigkeitsgraphen.
- `src/components/ArchitectureDiagram.astro`: eigene SVG-Architekturdiagramme.
- `src/layouts/SiteLayout.astro`: Kopfzeile, Sidebar, Suche und mobile Navigation.
- `src/scripts/`: progressive Erweiterungen und interaktiver Explorer.
- `examples/`: ausführbare TypeScript-Varianten, gemeinsames Fachmodell, In-Memory-Adapter und Tests.
- `src/styles/global.css`: eigenes responsives Design, Druckansicht und Reduced-Motion-Unterstützung.
- `../docs/`: Konzeption, Technologieentscheid und Prüfprotokoll.

## Funktionen

Startseite, vollständiger Lernpfad, anklickbare Diagrammkomponenten im Explorer, vier Architekturansichten, Umschaltung Laufzeit/Code, ausführbare Visit-Demo, Eingabevalidierung, Verständnisfragen, browserlokaler Lesefortschritt, Kapitelsuche, Quellen, Codeansicht, Zurück/Weiter, 404 und Sitemap. Lerninhalte sind statisches HTML und bleiben ohne JavaScript lesbar. JavaScript ist für Explorer, Suche, Quiz und Fortschritt nötig.

Die Suche durchsucht Kapiteltitel und Themenzuordnungen mit einigen Synonymen, nicht den vollständigen Artikeltext. Demo-Daten sind fiktiv und nicht dauerhaft gespeichert. Der Lesefortschritt wird ausschliesslich im Browser gespeichert. Die Schrift verwendet lokale Systemschriften (Segoe UI, Arial, Helvetica); es werden keine externen Schriftdateien geladen. Es gibt keine Anmeldung, Analytics oder Backend-API.

## Fachliche Einordnung

Kanonische PetClinic, Community-Varianten und eigene Refactorings werden getrennt gekennzeichnet. Auf Systemebene vergleichen wir denselben fachlichen Kern; die reale Modulith-Variante ergänzt eine Vet-Zuordnung. Unsere vier Code-Lehrbeispiele verwenden denselben Visit-Ablauf. Die SCS-PetClinic ist ein konzeptioneller Entwurf. Java-Ausschnitte sind didaktische Skizzen. Die ausführbaren TypeScript-Beispiele sind keine vollständigen Spring-Anwendungen. Quellen und feste Repository-Commits sind im Lernpfad und unter `/quellen/` verlinkt.

`npm run verify:sources` prüft mit Internetzugang ausgewählte Quellstellen an diesen Commits: Controller-Ablauf, 255-Zeichen-Grenze, Datenmodell ohne Vet-Zuordnung, Modulith-Erweiterung sowie Service- und Schichtenstruktur. Die Online-Prüfung ist bewusst vom normalen Build getrennt.

Der Explorer zeigt Laufzeitaufrufe zwischen ausführenden Komponenten. Eingangs- und Ausgangsports bleiben als anklickbare Verträge sichtbar, führen aber keine eigenen Schritte aus. Der Code-Modus zeigt die Abhängigkeiten zu diesen Verträgen. Die Beschreibungsgrenze der Demo beträgt wie beim betrachteten Original 255 Zeichen; Trimming und explizite Datumsvalidierung sind Demo-Details.

## GitHub Pages

`astro.config.mjs` enthält `site: https://guendeti.github.io` und `base: /projektarbeit-test`. Der Workflow im Repository-Hauptverzeichnis baut `whole-wavelength` und veröffentlicht bei Push auf `main`. In den Repository-Einstellungen muss Pages als Quelle **GitHub Actions** verwenden.

Öffentliche Adresse: https://guendeti.github.io/projektarbeit-test/
