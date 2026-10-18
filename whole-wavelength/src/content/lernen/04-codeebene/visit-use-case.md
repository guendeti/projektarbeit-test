---
title: "Unser gemeinsamer Visit-Use-Case"
slug: "visit-use-case"
lead: "Für ein vorhandenes Pet wird ein neuer Visit erfasst. Wir verfolgen diesen einen Ablauf durch den Code und verändern in den nächsten Kapiteln ausschliesslich seine architektonische Anordnung."
diagram: "visit"
takeaway: "Die Fachlichkeit bleibt konstant. Wir verändern, wer den Ablauf koordiniert und welche Code-Abhängigkeiten dafür nötig sind."
sources: [petclinic, visit]
question: "Welche Verantwortung übernimmt der Controller im kanonischen Visit-Ablauf zusätzlich zu HTTP?"
answers: [Er deployt die Datenbank., Er koordiniert das Laden und Speichern über das OwnerRepository., Er startet einen eigenen Microservice.]
correct: 1
explanation: "Der originale VisitController kennt das OwnerRepository direkt; eine separate Service-Schicht fehlt in diesem Ablauf."
---
## Das Szenario

Ein Owner existiert und besitzt ein Pet. Für dieses Pet soll ein Besuch gebucht werden. Die Eingabe enthält vier Werte:

```text
ownerId     → bestehender Owner
petId       → Pet dieses Owners
date        → zukünftiger Besuchstag
description → Anlass des Besuchs
```

Das Ergebnis ist ein gespeicherter Visit, der dem ausgewählten Pet zugeordnet ist. Für unsere Demonstration verwenden wir die Regeln: Owner und Pet müssen existieren, die Beschreibung darf nicht leer sein und das Datum muss nach dem heutigen Tag liegen.

## Der Ablauf im Original

Die kanonische PetClinic verwendet GET und POST unter `/owners/{ownerId}/pets/{petId}/visits/new`. Vor der Verarbeitung lädt eine `@ModelAttribute`-Methode den Owner über das OwnerRepository und bestimmt daraus das Pet. Ein neues Visit-Objekt wird für das Formular bereitgestellt.

Beim POST validiert der Controller die Eingabe. Der betrachtete Quellstand weist ein Datum ab, das nicht in der Zukunft liegt. Bei Erfolg wird der Visit hinzugefügt, der Owner gespeichert und auf die Owner-Seite weitergeleitet.

```text
HTTP Request
  → VisitController
  → Owner laden und Pet bestimmen
  → Visit validieren und hinzufügen
  → OwnerRepository.save(owner)
  → Redirect zur Owner-Seite
```

## Die architektonisch interessante Stelle

Der VisitController besitzt direkt ein OwnerRepository. Er behandelt damit nicht nur HTTP, sondern koordiniert auch den Zugriff auf fachliche Daten. Das ist eine konkrete Eigenschaft des Beispiels und kein Beweis, dass jeder Monolith so aufgebaut sein muss.

Unsere Frage lautet: **Wo soll die Verantwortung für den Use-Case liegen und von welchen technischen Details darf diese Logik abhängig sein?**

## Was gleich bleibt

In jeder Variante werden Owner und Pet bestimmt, Daten geprüft, der Visit hinzugefügt und das Ergebnis gespeichert. Controller, Fachlogik, Persistenz und Datenbank bleiben als Verantwortlichkeiten erhalten.

Die Varianten verändern ihre Anordnung. Layered führt einen Application Service ein. Clean trennt einen expliziten Use-Case von Adaptern. Hexagonal formuliert Eingangs- und Ausgangsports. Onion stellt das Domain Model ins Zentrum.

## Von Java zur ausführbaren Demonstration

Die Lernseiten zeigen vereinfachte Java-Ausschnitte, um an Spring PetClinic anzuknüpfen. Im Explorer laufen entsprechende kleine TypeScript-Varianten mit einer In-Memory-Persistenz. Sie veranschaulichen die Grenzen ohne Spring-Server. Es handelt sich um eigene Beispiele und nicht um Kopien der PetClinic-Implementierung.

Die Demonstration hat bewusst keine echte Terminverwaltung, Anmeldung oder dauerhafte Datenbank. Ihr Zweck ist der vergleichbare Ablauf durch unterschiedliche Verantwortlichkeiten.
