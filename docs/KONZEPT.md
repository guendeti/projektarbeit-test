# Umsetzungskonzept

## Didaktik und Informationsarchitektur

Leitidee: Die Fachlichkeit bleibt, die Architektur verändert sich. Systemebene bedeutet Zerlegung, Prozess- und Deployment-Grenzen; Codeebene bedeutet interne Verantwortlichkeiten und Code-Abhängigkeiten. Beide Ebenen sind kombinierbar.

Lernpfad: Grundlagen → System-/Codeebene → PetClinic → Monolith → Modular Monolith → Microservices → SCS/ISA → Visit → Layered → Clean → Hexagonal → Onion → Vergleich → Explorer.

Alle 13 Lernseiten enthalten Einführung, eigenes SVG-Diagramm, Erklärung, PetClinic-Bezug, Merksatz, Verständnisfrage und Quellen. Kapitel der System- und Codeebene beginnen mit einem kurzen Perspektivwechsel. Codevarianten verwenden dieselben Fachregeln. SCS bleibt ausdrücklich ein eigener Entwurf.

## Technologieentscheid

| Kriterium | Astro + Markdown | Vanilla HTML/CSS/TypeScript |
| --- | --- | --- |
| Wiederkehrende Navigation | Gemeinsames Layout | Eigener Template-/Build-Mechanismus nötig |
| Inhaltsbearbeitung | Markdown mit validiertem Schema | HTML oder eigene Inhaltsverarbeitung |
| Statisches Hosting | Build erzeugt HTML/CSS/JS | Direkt möglich; TypeScript benötigt Build |
| Crawling | Vollständige HTML-Lerntexte | Ebenfalls möglich bei statischem HTML |
| Interaktivität | Kleine bedarfsweise Skripte | Ebenfalls möglich |
| Abhängigkeiten | Astro und Buildwerkzeuge | Weniger Frameworkabhängigkeiten, mehr Eigenbau |

Entscheid: Astro für Layouts, statische Routen und Markdown. TypeScript für das Lab und die Beispielimplementierungen; eigenes CSS und SVG. React bringt für diese Interaktionen keinen nötigen Mehrwert und wird nicht verwendet. Keine Behauptung, dass Astro automatisch besseres SEO bietet: Entscheidend sind lesbares HTML, sinnvolle Überschriften, Metadaten und Links. GitHub Pages braucht keinen Serveradapter, da alle Routen statisch gebaut werden.

Technische Referenzen: https://docs.astro.build/en/guides/content-collections/ · https://docs.astro.build/en/guides/deploy/github/ · https://docs.astro.build/en/basics/astro-components/

## Wireframes und Seitentypen

### 1. Startseite (Desktop)

```text
┌─────────────────── Kopfzeile: Marke | Suche | GitHub ───────────────┐
│ Sidebar       │ Titel + Einführung          │ Architektur-Skizze   │
│ Lernpfad      │ [Starten] [Explorer]         │ System → Core        │
│ 01–04         ├────────────────────────────────────────────────────┤
│ Explorer      │ Didaktischer Leitsatz                              │
│ Quellen       ├────────────┬────────────┬────────────┬─────────────┤
│ Code          │ Grundlagen │ PetClinic  │ System     │ Code        │
│ Fortschritt   ├────────────────────────────────────────────────────┤
│               │ Explorer-Vorschau + Einstieg                       │
└───────────────┴────────────────────────────────────────────────────┘
```

### 2. Lernseite (Desktop)

```text
Sidebar | Breadcrumb / Kapitel / Lesezeit         | Inhaltsverzeichnis
        | Titel + Lead                            | Ankerlinks
        | SVG-Diagramm                            | Explorer-Verweis
        | Erklärung + Beispiel + Abwägung          |
        | Merksatz / Verständnisfrage / Quellen   |
        | Gelesen markieren / Zurück / Weiter     |
```

### 3. Architekturdetail (Desktop)

```text
Sidebar | Architektur-Titel + Kernaussage          | Abschnittsanker
        | Architekturspezifisches SVG-Modell       |
        | Verantwortlichkeiten / Visit-Zuordnung   |
        | Java-Beispiel / Package-Struktur         |
        | Laufzeit vs. Code / Trade-offs           |
        | Merksatz / Quiz / Quellen / Navigation   |
```

### 4. Explorer (Desktop)

```text
Sidebar | Titel + gemeinsamer Use-Case
        | [Layered][Clean][Hexagonal][Onion] [Laufzeit][Code]
        | Benutzer → interaktiver Komponenten-Graph → Datenbank
        | Baustein-Details              | Architektur-Erklärung
        | Visit-Formular                | Ablaufprotokoll + Ergebnis
```

### Mobile Navigation

```text
Marke | Suche | Menü
Titel / Inhalt in einer Spalte
Menü öffnet die Kapitelnavigation; Escape schliesst sie.
Diagramme skalieren; Explorer ist horizontal scrollbar.
Formular und Protokoll stehen untereinander.
```

## Designregeln

Eigenständige Gestaltung als ruhiges Lernhandbuch: warmes Papierweiss, dunkles Grün, Salbei für den Kern, Ocker für Verträge. Feste Kapitelnavigation, begrenzte Textbreite und klare Überschriften. Figuren dienen der Erklärung und werden mit Bedeutung und Herkunft versehen. Keine Fortschrittsleiter von Monolith zu Microservices. Die zusätzliche Struktur der Codevarianten wird als Abwägung dargestellt.

## Grenzen des Umfangs

Die Website und die kleinen Beispiele sind implementiert. Ein vollständiger wissenschaftlicher Schlussbericht, reale Nutzerstudien, vier produktionsreife Spring-Systeme und eine offizielle SCS-PetClinic gehören nicht zu diesen Artefakten. Das Prüfprotokoll benennt tatsächlich ausgeführte Prüfungen und offene Nachweise.
