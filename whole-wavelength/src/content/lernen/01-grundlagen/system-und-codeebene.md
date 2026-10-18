---
title: "System- und Codeebene"
slug: "system-und-codeebene"
lead: "Bevor wir Architekturen vergleichen, brauchen wir eine gemeinsame Perspektive. Betrachten wir die Grenzen des Gesamtsystems – oder die Verantwortlichkeiten innerhalb einer einzelnen Anwendung?"
diagram: "zoom"
takeaway: "Systemebene und Codeebene beantworten unterschiedliche Fragen. Ein Microservice kann intern beispielsweise hexagonal aufgebaut sein."
sources: [layering, microservices, modulith, isa]
question: "Kann ein Microservice intern Layered Architecture verwenden?"
answers: ['Ja, System- und Codearchitektur sind kombinierbar.', 'Nein, Microservices ersetzen alle Schichten.', 'Nur wenn er keine Datenbank verwendet.']
correct: 0
explanation: "Microservices definieren die Service-Grenzen; Layered beschreibt die interne Organisation eines Services."
---
## Systemebene: das Ganze zerlegen

Die Systemebene beantwortet: **Wie wird die gesamte Anwendung in ausführbare beziehungsweise fachlich eigenständige Teile zerlegt, deployt und miteinander verbunden?**

Wir betrachten Monolith, Modular Monolith, Microservices und Self-contained Systems. Interessant sind Prozessgrenzen, Deployment-Einheiten, Netzwerkkommunikation und fachliche Autonomie.

Ein Modul ist dabei nicht automatisch ein Prozess. Im Modular Monolith bleiben alle Module in derselben Anwendung. Erst separate Deployments verändern auch die physische Struktur.

## Codeebene: in eine Einheit hineinzoomen

Die Codeebene beantwortet: **Wie werden Verantwortlichkeiten und Abhängigkeiten innerhalb einer Anwendung oder eines einzelnen Services organisiert?**

Hier betrachten wir Layered, Clean, Hexagonal und Onion Architecture. Wir fragen, wer den Use-Case koordiniert, wo ein Persistenzvertrag liegt und ob Fachlogik ein bestimmtes Framework kennen muss.

```text
Gesamtsystem
└── ein Service oder eine Anwendung
    └── Visit-Use-Case
        ├── Web
        ├── Anwendung & Domäne
        └── Persistenz
```

## Logische Schichten sind keine Server

Eine Presentation-, Business- und Data-Access-Schicht kann vollständig in einem Java-Prozess laufen. Umgekehrt kann ein verteiltes System mehrere Anwendungen enthalten, die jeweils intern mehrere Schichten besitzen. Die Anzahl der Schichten sagt deshalb nichts über die Anzahl der Deployments aus.

Die Trennung ist didaktisch hilfreich, aber nicht absolut: Fachliche Modulgrenzen können die Grundlage für spätere Service-Grenzen bilden. Eine Verteilung ersetzt die Arbeit an diesen Grenzen jedoch nicht.

## Zwei Arten von Pfeilen

**Laufzeitfluss** beschreibt, wer während der Verarbeitung wen aufruft. **Code-Abhängigkeit** beschreibt, welcher Code einen anderen Typ oder Vertrag kennen muss.

```text
Laufzeit:           Use-Case → Persistenzadapter
Code-Abhängigkeit:  Persistenzadapter → inneres Repository-Interface
```

Das Interface wird zur Laufzeit von einem äusseren Adapter implementiert. Der Use-Case muss deshalb den konkreten Adapter nicht kennen. Diese Unterscheidung wird im Explorer ausdrücklich umschaltbar.

## Kombinationen sind erwünscht

Ein Modular Monolith kann ein hexagonales Owner-Modul enthalten. In einer Microservice-Landschaft kann der Customers Service klassisch geschichtet sein, während der Visits Service Clean Architecture verwendet. ISA nennt die systemweiten Regeln Macro Architecture und die intern frei wählbare Struktur Micro Architecture.
