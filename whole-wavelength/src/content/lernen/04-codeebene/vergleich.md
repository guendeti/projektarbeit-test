---
title: "Vier Architekturen im Vergleich"
slug: "vergleich"
lead: "Gleiche Fachlichkeit, unterschiedliche Denkmodelle. Besonders Clean, Hexagonal und Onion sind eng verwandt – sie heben andere Aspekte derselben Entkopplung hervor."
diagram: "compare"
takeaway: "Architekturansätze können sich ergänzen. Vergleiche konkrete Grenzen, Verantwortlichkeiten und Abhängigkeiten statt nur Namen und Diagrammformen."
sources: [layering, clean, hexagonal, onion, microservices]
question: "Was ist die wichtigste Gemeinsamkeit von Clean, Hexagonal und Onion?"
answers: [Sie benötigen immer Microservices., Sie verbieten alle Aufrufe zur Datenbank., Sie isolieren den Kern über nach innen gerichtete Code-Abhängigkeiten.]
correct: 2
explanation: "Ein innerer Vertrag erlaubt Aufrufe nach aussen, ohne eine statische Abhängigkeit zur konkreten Infrastruktur zu erzeugen."
---
## Derselbe Use-Case als Massstab

Alle Varianten erhalten Owner-ID, Pet-ID, Datum und Beschreibung. Sie bestimmen Owner und Pet, prüfen das Datum, fügen den Visit hinzu und speichern das Ergebnis. Weder die Fachfunktion noch die gewünschte Ausgabe ändern sich.

Was sich verändert, ist die Architektur darum herum.

## Die Denkmodelle nebeneinander

| Kriterium | Layered | Clean | Hexagonal | Onion |
| --- | --- | --- | --- | --- |
| Primärer Blick | Horizontale Schichten | Zentrale Regeln und Grenzen | Innen / aussen | Ringe um die Domäne |
| Innerer Schwerpunkt | Business / Domain | Entities und Use Cases | Application Core | Domain Model |
| Use-Case | Häufig Service | Expliziter Interactor | Über Input Port | Application Service |
| Abhängigkeiten | Klassisch oben → unten | Nach innen | Adapter → Ports / Kern | Nach innen |
| Datenbank | Data Access unten | Äusseres Detail | Driven Adapter | Infrastruktur aussen |
| Web | Presentation | Äusserer Adapter | Driving Adapter | UI aussen |
| Typischer Vertrag | Repository der Datenschicht | Gateway | Output Port | Repository im Core |

Die Tabelle beschreibt unsere Vergleichsvarianten. Sie ist keine Norm, die jede reale Implementierung exakt erfüllen muss.

## Die zentrale Gemeinsamkeit

Clean, Hexagonal und Onion wollen verhindern, dass fachlich zentrale Logik von wechselnden technischen Mechanismen abhängig wird. Ein innerer Vertrag wird durch eine äussere technische Komponente erfüllt.

```text
Use-Case ───▶ inneres Interface ◀─── Persistenzadapter
```

Der Use-Case kann den Adapter zur Laufzeit verwenden, ohne seinen Typ zu kennen. Dieses Dependency-Inversion-Prinzip ist im Explorer anhand unterschiedlicher Pfeile nachvollziehbar.

## Wo liegt Layered anders?

Unsere klassische Layered-Variante kennt eine Datenzugriffsschicht unterhalb des Services. Die Trennung der Verantwortlichkeiten ist sichtbar, die Persistenzabhängigkeit aber noch nicht an einem inneren Vertrag umgedreht.

Layered verbietet eine solche Umkehr nicht. Eine Anwendung kann fachlich geschichtet sein und an ihren Grenzen Ports und Adapter nutzen. Die Begriffe sind daher keine vier vollständig disjunkten Kategorien.

Ein Interface allein entscheidet den Vergleich nicht. Auch Layered kann Repository-Abstraktionen und austauschbare Implementierungen verwenden. Wir betrachten, ob der Persistenzvertrag dem inneren Anwendungskern gehört oder von der äusseren Datenschicht vorgegeben wird.

## Testbarkeit, Wartbarkeit und Aufwand

| Frage | Klassische Layered-Variante | Varianten mit inneren Verträgen |
| --- | --- | --- |
| Use-Case ohne HTTP testen? | Mit Service möglich | Über Use-Case / Input Port möglich |
| Persistenz im Test ersetzen? | Abhängig vom Repository-Schnitt | Über den inneren Vertrag vorgesehen |
| Technik austauschen? | Kopplung zur Datenschicht prüfen | Adapter und Mapping anpassen |
| Struktureller Aufwand? | Häufig weniger zusätzliche Typen | Interfaces, Commands und Adapter |
| Automatisch wartbarer? | Nein | Ebenfalls nein |

Die Muster schaffen Möglichkeiten. Ob Tests hilfreich, Grenzen passend und Änderungen einfacher werden, hängt von ihrer konkreten Umsetzung ab. Aus einem Diagramm lässt sich keine empirisch bewiesene Qualitätssteigerung ableiten.

Die ausführbaren Java-/Spring-Varianten auf der Seite „Beispielcode“ ergänzen die Browser-Demo um echte HTTP-Anfragen, JDBC-Persistenz und ArchUnit-Regeln. Sie implementieren denselben Visit als eigenständigen Lehrausschnitt; die vollständige PetClinic wird nicht nachgebaut. Unsere kleinen TypeScript-Varianten zeigen diesen Mechanismus in Isolation. Sie belegen keine vollständige Architekturkonformität einer produktiven Spring-Anwendung. Java-Skizzen und Browser-Demo unterscheiden sich ausserdem in der Aufteilung der Validierung: Die Java-Ausschnitte zeigen die Datumsprüfung im Application Service, die Demo bündelt die gemeinsamen Fachprüfungen in einer Domain-Funktion. Diese Wahl muss nicht durch den Architekturnamen vorgegeben sein.

## Kein Sieger ohne Kontext

Layered macht die Aufgabentrennung leicht verständlich. Clean macht Use-Cases und zentrale Regeln explizit. Hexagonal zeigt die Interaktionen an der Anwendungsgrenze. Onion betont den fachlichen Mittelpunkt.

Bei unserem kleinen Visit kann ein strenger Aufbau mehr Struktur erzeugen, als die Fachlichkeit benötigt. Bei einem langlebigen Kern mit vielen Integrationen können genau diese Grenzen wertvoll sein.

## Beide Ebenen zusammendenken

Ein Modular Monolith kann mehrere hexagonale Module enthalten. Eine Microservice-Landschaft kann Layered im Customers Service, Clean im Visits Service und Hexagonal im Vets Service kombinieren.

Systemarchitektur beantwortet, wie das Gesamtsystem zerlegt und deployt wird. Codearchitektur beantwortet, wie Verantwortlichkeiten und Abhängigkeiten innerhalb einer solchen Einheit organisiert werden.

## Jetzt selbst untersuchen

Im Architecture Explorer kannst du die vier Varianten umschalten, Komponenten auswählen und einen Visit mit Beispieldaten erfassen. Wechsle dabei gezielt zwischen Laufzeitfluss und Code-Abhängigkeiten: Was bleibt gleich, und an welcher Stelle dreht sich ein Pfeil um?
