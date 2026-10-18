---
title: "Was ist Softwarearchitektur?"
slug: "softwarearchitektur"
lead: "Softwarearchitektur beschreibt die grundlegende Struktur einer Anwendung – ihre Bausteine, deren Verantwortung und die Beziehungen zwischen ihnen. Sie hilft uns, bewusste Entscheidungen über Veränderbarkeit, Betrieb und Komplexität zu treffen."
diagram: "zoom"
takeaway: "Architektur ist eine bewusste Entscheidung über Grenzen und Abhängigkeiten. Ein Muster ist ein Werkzeug, kein Qualitätsversprechen."
sources: [layering, microservices, clean]
question: "Welche Frage ist eine Architekturfrage?"
answers: [Welche Farbe hat ein Button?, Welche Teile können unabhängig deployt werden?, Wie heisst eine lokale Variable?]
correct: 1
explanation: "Die Deployment-Grenze beeinflusst Struktur, Zusammenarbeit und Betrieb des Gesamtsystems."
---
## Mehr als Kästen und Pfeile

Stell dir eine Tierarztpraxis vor. Die Software verwaltet Tierhalter, Tiere und Besuche. Doch dieselbe Fachlichkeit kann ganz unterschiedlich organisiert sein: als eine Anwendung, als klar abgegrenzte Module oder als mehrere Services. Innerhalb jeder Anwendung können Controller, Fachlogik und Persistenz wiederum unterschiedlich zusammenarbeiten.

Ein Architekturdiagramm macht solche Entscheidungen sichtbar. Entscheidend ist, was seine Kästen und Pfeile bedeuten: Ist ein Kasten ein Java-Package, ein Prozess oder ein eigenständig deploybares System? Bedeutet ein Pfeil einen Methodenaufruf oder eine Quellcode-Abhängigkeit? Ohne diese Bedeutung bleibt das Bild mehrdeutig.

## Die Fragen hinter der Struktur

Architektur hilft, wiederkehrende Fragen zu beantworten:

- **Verantwortung:** Welcher Baustein trifft eine fachliche Entscheidung?
- **Abhängigkeiten:** Welche Bausteine müssen andere Bausteine kennen?
- **Änderungen:** Welche Teile werden bei einer Änderung gemeinsam angepasst?
- **Betrieb:** Was wird gemeinsam gestartet, skaliert und veröffentlicht?
- **Grenzen:** Welche Details dürfen andere Teile sehen?

Ein Architekturansatz setzt dabei einen Schwerpunkt. Microservices betreffen vor allem separat deploybare Services. Clean Architecture beschäftigt sich besonders mit der Richtung von Code-Abhängigkeiten. Beide beschreiben unterschiedliche Aspekte und können gemeinsam eingesetzt werden.

## Ein Beispiel statt wechselnder Fachlichkeit

In diesem Lernpfad verwenden wir durchgehend die Spring PetClinic. Auf der Systemebene betrachten wir die Tierarztpraxis als Ganzes. Auf der Codeebene verfolgen wir immer denselben Use-Case: **Für ein bestehendes Pet einen Visit erfassen.**

```text
Owner existiert → Pet gehört zum Owner → Visit wird erfasst
```

Damit bleibt der fachliche Ablauf vergleichbar. Wenn sich eine Klasse oder eine Schnittstelle verändert, sehen wir, welche Architekturentscheidung dahintersteht.

## Es gibt keinen universellen Sieger

Jede Grenze hat einen Preis. Ein Interface kann Technik austauschbar machen, benötigt aber einen Vertrag und eine Implementierung. Ein eigener Service schafft eine Prozessgrenze, bringt aber Netzwerkfehler, unabhängige Deployments und Überwachung mit sich.

Für eine kleine Anwendung kann eine direkte Struktur passend sein. Eine langlebige Anwendung mit komplexen Regeln kann von einem stärker isolierten Kern profitieren. Wichtiger als die Anzahl eingesetzter Muster ist, ob die Struktur zum Problem passt.

## So arbeitest du mit dem Lernpfad

Beginne mit der Unterscheidung zwischen System- und Codeebene. Lerne danach die PetClinic kennen, bevor du die Architekturvarianten vergleichst. Jedes Kapitel hat ein Diagramm, einen Merksatz und eine kurze Verständnisfrage. Im Architecture Explorer kannst du anschliessend den identischen Ablauf in vier Varianten untersuchen.
