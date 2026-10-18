---
title: "System- und Codeebene"
slug: "system-und-codeebene"
lead: "Softwarearchitektur lässt sich aus unterschiedlichen Perspektiven betrachten. Wir unterscheiden die Aufteilung des Gesamtsystems von der internen Organisation einer Anwendung oder eines Services."
diagram: "zoom"
takeaway: "Die Systemebene betrachtet Zerlegung, Kommunikation und Betrieb des Gesamtsystems. Die Codeebene untersucht Verantwortlichkeiten und Abhängigkeiten innerhalb einer Anwendung."
sources: [layering, microservices, modulith, isa]
question: "Kann ein Microservice intern Layered Architecture verwenden?"
answers: ['Ja, System- und Codearchitektur sind kombinierbar.', 'Nein, Microservices ersetzen alle Schichten.', 'Nur wenn er keine Datenbank verwendet.']
correct: 0
explanation: "Microservices definieren Service-Grenzen; Layered beschreibt die interne Organisation eines Services."
---
## Systemebene: Wie ist die Anwendung als Ganzes aufgebaut?

Die Systemebene betrachtet die Struktur des Gesamtsystems. Beispielsweise kann die PetClinic als gemeinsame Anwendung ausgeführt oder auf mehrere unabhängig deploybare Services verteilt werden.

Die zentralen Fragen lauten:

- Welche fachlichen Teile gibt es?
- Wo verlaufen Modul- und Systemgrenzen?
- Welche Teile werden gemeinsam oder unabhängig deployt, also bereitgestellt?
- Wie kommunizieren getrennte Systemteile?

Wir betrachten Monolith, Modular Monolith, Microservices und Self-contained Systems. ISA ergänzt Prinzipien für unabhängige Systeme.

Ein Modul ist nicht automatisch ein eigener Prozess. Im Modular Monolith laufen die fachlichen Module weiterhin in einer gemeinsamen Anwendung.

## Codeebene: Wie ist eine Anwendung intern organisiert?

Die Codeebene betrachtet Verantwortlichkeiten und Quellcode-Abhängigkeiten innerhalb einer Anwendung oder eines Services.

Beim Erfassen eines Besuchs müssen beispielsweise HTTP-Anfragen verarbeitet, fachliche Regeln geprüft und Daten gespeichert werden. Die Fragen dazu lauten:

- Wo befindet sich die fachliche Logik?
- Welche Aufgaben übernimmt der Controller?
- Wie wird die Persistenz, also das Laden und Speichern von Daten, angebunden?
- Von welchen technischen Details ist die Fachlogik abhängig?

Hier vergleichen wir Layered, Clean, Hexagonal und Onion Architecture. Den Begriff Use-Case verwenden wir für einen fachlichen Anwendungsfall: bei uns das Erfassen eines Visits.

## Wie hängen beide Perspektiven zusammen?

Ein Microservice kann intern beispielsweise nach Clean Architecture aufgebaut sein. Ein Modular Monolith kann fachliche Module enthalten, die jeweils eine eigene interne Schichtenstruktur besitzen.

```text
Gesamtsystem
└── eine Anwendung / ein Service
    └── interne Organisation des Visit-Use-Cases
```

Die Zweiteilung ist eine didaktische Vereinfachung und keine allgemeingültige, vollständige Einteilung der Softwarearchitektur. Beide Perspektiven beeinflussen sich, sind aber nicht identisch.

## Logische Schichten sind keine Server

Presentation, Fachlogik und Datenzugriff können vollständig in einem Prozess laufen. Umgekehrt kann ein verteiltes System mehrere Anwendungen enthalten, die intern jeweils mehrere Schichten besitzen.

Die Zahl der Schichten sagt deshalb nichts über die Zahl der Deployments aus. Ebenso garantiert eine Verteilung über mehrere Prozesse noch keine gute fachliche Modularisierung.

## Was bedeuten die Pfeile?

Ein Diagramm braucht eine eindeutige Bedeutung seiner Beziehungen. Ein **Laufzeitaufruf** zeigt, wer während der Verarbeitung wen aufruft. Eine **Code-Abhängigkeit** zeigt, welcher Code einen anderen Typ oder Vertrag kennt.

Diese Richtungen müssen nicht übereinstimmen. Wie das mit Interfaces funktioniert, untersuchen wir auf der Codeebene und im Explorer. Zunächst lernen wir die gemeinsame Beispielanwendung kennen.
