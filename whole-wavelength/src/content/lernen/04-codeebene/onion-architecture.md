---
title: "Onion Architecture"
slug: "onion-architecture"
lead: "Die Fachdomäne bildet den stabilen Mittelpunkt. Anwendung, UI und Infrastruktur liegen darum herum; Code-Abhängigkeiten zeigen in Richtung des inneren Kerns."
diagram: "onion"
takeaway: "Die Datenbank ist ein äusseres Infrastrukturdetail. Der Domain-Kern und seine Verträge bestimmen, was die äusseren Implementierungen erfüllen müssen."
sources: [onion, clean, visit]
question: "Wo liegt die konkrete JPA-Implementierung in unserer Onion-Variante?"
answers: [Im innersten Domain Model., Als äussere Infrastruktur hinter einem inneren Vertrag., Im Browser des Owners.]
correct: 1
explanation: "Das Repository-Interface liegt im Application Core; die technische Implementierung hängt von diesem Interface ab."
---
## Die Domäne im Mittelpunkt

Jeffrey Palermo beschreibt Onion Architecture mit einem zentralen Domain Model und nach innen gerichteter Kopplung. UI, Datenbanken und andere technische Mechanismen werden an den äusseren Rand verschoben.

Für unsere Tierarztpraxis stehen Owner, Pet und Visit im Zentrum. Sie beschreiben die Fachlichkeit, nicht die Technik, mit der eine HTTP-Anfrage ankommt oder ein Datensatz gespeichert wird.

## Fachliches Verhalten statt technischer Details

Eine fachliche Operation kann den Visit dem passenden Pet zuordnen:

```java
owner.addVisit(petId, visit);
```

Dass ein Visit zum Pet eines Owners gehört, ist eine fachliche Beziehung. Dass sie über JPA und eine SQL-Datenbank gespeichert wird, ist eine äussere Implementierungsentscheidung.

Eine konsequent isolierte Domäne kennt keine Spring-MVC-Requests oder konkrete JPA-Repositories. Ein eigenes Mapping zwischen Domain Model und Persistenzmodell kann dafür nötig werden.

## Application Core als nächster Ring

Der BookVisitService koordiniert den Ablauf um die Domäne herum. Er benötigt einen Vertrag zum Laden und Speichern:

```java
public interface OwnerRepository {
    Optional<Owner> findById(int id);
    void save(Owner owner);
}
```

Das Interface gehört zum inneren Anwendungsbereich. Ein äusserer JpaOwnerRepositoryAdapter implementiert es. Die Zusammenstellung geschieht in der äusseren Konfiguration.

```text
UI / Infrastructure
├── VisitController
├── JpaOwnerRepositoryAdapter
└── Spring-Konfiguration
          ↓
Application Core
├── BookVisitService
└── OwnerRepository (Vertrag)
          ↓
Domain Model
└── Owner / Pet / Visit
```

## Der Laufzeitfluss darf nach aussen gehen

Ein Use-Case muss seine Daten weiterhin speichern. Onion verbietet diesen Aufruf nicht. Entscheidend ist, dass der innere Code nur den inneren Vertrag kennt:

```text
Laufzeit: BookVisitService → eingesetzter Adapter
Code:     Adapter → OwnerRepository ← BookVisitService
```

Damit bleibt der Kern von der konkreten technischen Persistenz entkoppelt.

## Onion, Hexagonal und Clean

Onion betont das Domain Model als Zentrum und die Schichten darum herum. Hexagonal betont Ports und Adapter an der Grenze zur Aussenwelt. Clean unterscheidet besonders explizit allgemeine Fachregeln, anwendungsspezifische Use-Cases und äussere Mechanismen.

Die Ähnlichkeit ist beabsichtigt. Clean nimmt unter anderem auf Onion und Hexagonal Bezug. Eine gut isolierte Implementierung kann deshalb zu allen drei Beschreibungen passen.

## Wann lohnt sich der Aufwand?

Ein langlebiges, fachlich komplexes Modell kann von einer stabilen Mitte profitieren. Die zusätzlichen Verträge und Übersetzungen kosten jedoch Implementierungsaufwand. Bei einer kleinen CRUD-Anwendung muss geprüft werden, ob diese Grenzen eine konkrete Veränderung oder ein relevantes Risiko adressieren.
