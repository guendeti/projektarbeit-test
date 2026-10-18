# Umsetzungskonzept

## Didaktik und Informationsarchitektur

Leitidee: Die Fachlichkeit bleibt, die Architektur verändert sich. Systemebene bedeutet Zerlegung, Prozess- und Deployment-Grenzen; Codeebene bedeutet interne Verantwortlichkeiten und Code-Abhängigkeiten. Beide Ebenen sind kombinierbar.

Lernpfad: Grundlagen → System-/Codeebene → PetClinic → Monolith → Modular Monolith → Microservices → SCS/ISA → Visit → Layered → Clean → Hexagonal → Onion → Vergleich → Explorer.

Alle 13 Lernseiten enthalten Einführung, eigenes SVG-Diagramm, Erklärung, PetClinic-Bezug, Merksatz, Verständnisfrage und Quellen. Kapitel der System- und Codeebene beginnen mit einem kurzen Perspektivwechsel. Codevarianten verwenden dieselben Fachregeln. SCS bleibt ausdrücklich ein eigener Entwurf.

Die Einstiegsseiten erklären zuerst Problem, Fachdomäne und Leitfragen. Ports und Dependency Inversion werden erst auf der Codeebene vertieft. „Gleiche Fachlichkeit“ gilt für unsere vier Code-Lehrbeispiele; reale Community-Varianten können zusätzliche Funktionen enthalten. Der Quellenbereich dokumentiert vier feste Repository-Commits und ordnet konkrete Aussagen den jeweiligen Quellstellen zu.

Im Explorer sind Verträge keine zusätzlichen Laufzeitstationen. Laufzeitpfeile verbinden ausführende Komponenten und nennen den verwendeten Vertrag. Die anklickbaren Vertragsmarkierungen bleiben zur Orientierung sichtbar; in der Codeansicht sind sie Ziele der Abhängigkeits- und Implementierungsbeziehungen. Das Ablaufprotokoll spielt aufgezeichnete Ausführungsschritte ab.

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

## Aktueller Seitenaufbau

Die Gestaltung wurde nach Nutzerfeedback vereinfacht. Als Referenzen für eine inhaltsorientierte Lernseite dienen W3Schools, Refactoring.Guru und CS50 Python.

- **Startseite:** kurze Einführung und vier einfache, nummerierte Lernpfad-Einträge. Keine Hero-Illustration, Statistiken, Teaser oder zusätzlichen Werbetexte.
- **Lernseite / Architekturdetail:** linke Kapitelnavigation, Breadcrumb, Titel und Einführung, Diagramm, Lerntext und Beispiele, Merksatz, Verständnisfrage, Quellen, Lesefortschritt sowie Zurück/Weiter. Kein rechtes Inhaltsverzeichnis und keine Lesezeitanzeige.
- **Explorer:** unveränderte Architekturwahl, zwei Pfeilansichten, interaktives Diagramm, Bausteindetails, Visit-Formular und Ablaufprotokoll.
- **Mobil:** Navigation über Menü; Lerntext in einer Spalte. Explorer-Diagramm horizontal scrollbar; Formular und Protokoll untereinander.

## Designregeln

Weisser Hintergrund, schwarze Lerntexte und dezente blaue Akzente (#0064a6). Gut lesbare lokale Systemschriften: Segoe UI, Arial, Helvetica, sans-serif. Lerntexte mit 18 Pixeln und kräftigerer Grundschrift, klaren Überschriften und grosszügigem Zeilenabstand. Keine externen Webfonts. Einfache Trennlinien und flache Flächen statt dekorativer Kacheln und Illustrationen auf der Startseite. Inhalte und interaktive Funktionen bleiben erhalten.

Referenzen: https://www.w3schools.com/css/default.asp · https://refactoring.guru/refactoring/catalog · https://cs50.harvard.edu/python/

## Grenzen des Umfangs

Die Website und die kleinen Beispiele sind implementiert. Ein vollständiger wissenschaftlicher Schlussbericht, reale Nutzerstudien, vier produktionsreife Spring-Systeme und eine offizielle SCS-PetClinic gehören nicht zu diesen Artefakten. Das Prüfprotokoll benennt tatsächlich ausgeführte Prüfungen und offene Nachweise.
