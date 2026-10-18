---
title: "Hexagonal Architecture"
slug: "hexagonal-architecture"
lead: "Die Anwendung liegt innen, Technik liegt aussen. Ports beschreiben angebotene und benötigte Interaktionen; Adapter verbinden diese Verträge mit Web, Datenbank oder Tests."
diagram: "hexagonal"
takeaway: "Ein Port definiert eine Interaktion aus Sicht der Anwendung. Ein Adapter verbindet diese Interaktion mit einer konkreten Technologie."
sources: [hexagonal, clean]
question: "Muss eine hexagonale Anwendung genau sechs Ports besitzen?"
answers: ['Ja, eine Seite pro Port.', 'Nein, das Hexagon veranschaulicht innen und aussen.', 'Ja, sonst ist es Clean Architecture.']
correct: 1
explanation: "Die Form ist ein Denkbild. Die Anzahl der Interaktionen bestimmt die benötigten Ports."
---
## Innen und aussen statt oben und unten

Alistair Cockburn beschreibt Ports and Adapters mit dem Ziel, Anwendungen unabhängig von ihren konkreten Eingabe- und Ausgabegeräten entwickeln und testen zu können. Weboberfläche, automatisierte Tests und andere Programme können denselben Anwendungskern ansteuern.

Das Hexagon steht nicht für sechs vorgeschriebene Komponenten. Es bietet Platz für mehrere unterschiedliche Interaktionen mit der Aussenwelt.

## Driving Side: die Anwendung aufrufen

Ein Input Port beschreibt eine Fähigkeit der Anwendung:

```java
public interface BookVisitUseCase {
    void bookVisit(BookVisitCommand command);
}
```

Dieser Vertrag sagt „Visit erfassen“. Er sagt nicht „Spring-MVC-POST verarbeiten“. Die konkrete HTTP-Übersetzung übernimmt der VisitWebAdapter.

```text
Browser → VisitWebAdapter → BookVisitUseCase
Test    → Testadapter     → BookVisitUseCase
```

Der BookVisitService implementiert den Eingangsport. Ein Test kann ihn ohne Webframework aufrufen.

## Driven Side: etwas von aussen benötigen

Für unseren Ablauf muss die Anwendung Owner laden und speichern. Sie definiert einen Output Port:

```java
public interface OwnerRepositoryPort {
    Optional<Owner> findById(int ownerId);
    void save(Owner owner);
}
```

Ein JpaOwnerAdapter implementiert ihn mit Spring Data JPA. Ein InMemoryOwnerAdapter kann denselben Vertrag für Tests erfüllen. Der Kern muss beide nicht kennen.

```text
BookVisitService → OwnerRepositoryPort ← JpaOwnerAdapter
```

Beide Pfeile zeigen Code-Abhängigkeiten auf den inneren Vertrag. Zur Laufzeit gelangt der Aufruf durch den Port zur eingesetzten Implementierung.

## Eine mögliche Projektstruktur

```text
visit/
├── domain/
│   └── Owner, Pet, Visit
├── application/
│   ├── BookVisitService
│   └── port/
│       ├── in/BookVisitUseCase
│       └── out/OwnerRepositoryPort
└── adapter/
    ├── in/web/VisitWebAdapter
    └── out/persistence/JpaOwnerAdapter
```

Das ist unsere Java-orientierte Umsetzung. Das Muster selbst schreibt keine Package-Namen vor. Wichtig ist, dass technische Adapter nicht in die Anwendungslogik hineinwachsen.

## Warum ähnelt das Clean Architecture?

Die Konzepte teilen die Entkopplung des Kerns von technischen Mechanismen. Clean betont unterschiedlich zentrale Regeln und explizite Use-Cases. Hexagonal betont die Anwendungsgrenze und die Arten der Interaktion.

Eine reale Codebasis kann beide Sichtweisen erfüllen. Die Frage ist deshalb nicht, welches Wort „richtig“ ist, sondern ob ihre Grenzen und Abhängigkeitsrichtungen nachvollziehbar sind.

## Stärken und Abwägung

Ports machen technische Bedürfnisse sichtbar. Adapter ermöglichen Tests mit Ersatzimplementierungen und zusätzliche Zugänge zum selben Use-Case. Zu viele zu kleine Ports oder technisch zugeschnittene Verträge können aber unnötige Komplexität erzeugen. Ein Interface allein garantiert noch keine sinnvolle Entkopplung.
