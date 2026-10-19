---
title: "Unser gemeinsamer Visit-Use-Case"
slug: "visit-use-case"
lead: "Für ein vorhandenes Pet wird ein neuer Visit erfasst. Wir verfolgen diesen einen Ablauf durch den Code und verändern in den nächsten Kapiteln ausschliesslich seine architektonische Anordnung."
diagram: "visit"
takeaway: "Die Fachlichkeit bleibt konstant. Wir verändern, wer den Ablauf koordiniert und welche Code-Abhängigkeiten dafür nötig sind."
sources: [petclinic, visit, visit-model, petclinic-schema]
question: "Welche Verantwortung übernimmt der Controller im kanonischen Visit-Ablauf zusätzlich zu HTTP?"
answers: [Er deployt die Datenbank., Er koordiniert das Laden und Speichern über das OwnerRepository., Er startet einen eigenen Microservice.]
correct: 1
explanation: "Der originale VisitController kennt das OwnerRepository direkt; eine separate Service-Schicht fehlt in diesem Ablauf."
---
## Das Szenario

Ein Owner existiert und besitzt ein Pet. Für dieses Pet wird ein Besuch mit Datum und Beschreibung erfasst. Der vereinfachte Eingabevertrag enthält vier Werte:

```text
ownerId     → bestehender Owner
petId       → Pet dieses Owners
date        → zukünftiger Besuchstag
description → Anlass des Besuchs
```

Das Ergebnis ist ein gespeicherter Visit, der dem ausgewählten Pet zugeordnet ist. Für unsere Demonstration verwenden wir die Regeln: Owner und Pet müssen existieren, die Beschreibung darf nicht leer sein und das Datum muss nach dem heutigen Tag liegen.

Die Beschreibung darf wie im untersuchten Visit-Modell höchstens 255 Zeichen enthalten. Die Demo entfernt zusätzlich äussere Leerzeichen und validiert das Datumsformat ausdrücklich. Das sind bewusst implementierte Demo-Details. Ein bestimmter Vet, eine Uhrzeit und freie Terminkapazitäten gehören nicht zum betrachteten Originalablauf.

## Der Ablauf im Original

Die kanonische PetClinic verwendet GET und POST unter `/owners/{ownerId}/pets/{petId}/visits/new`. Vor der Verarbeitung lädt eine `@ModelAttribute`-Methode den Owner über das OwnerRepository und bestimmt daraus das Pet. Ein neues Visit-Objekt wird für das Formular bereitgestellt.

Owner-ID und Pet-ID stammen dabei aus dem URL-Kontext. Datum und Beschreibung werden im Formular eingegeben. Unser Command fasst diese Informationen zur Vereinfachung in einem Datenobjekt zusammen.

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

Das gilt für unsere vier Code-Lehrbeispiele. Reale Community-Varianten können darüber hinaus neue Fachfunktionen ergänzen; insbesondere weist die betrachtete Modulith-PetClinic nach einem Event einen Vet zu. Diese zusätzliche Funktion gehört nicht zum Explorer.

## Von Java zur ausführbaren Demonstration

Die Lernseiten zeigen Ausschnitte der ausführbaren Java-Varianten: VisitCommand transportiert die Eingabe, Owner.addVisit prüft die gemeinsamen Fachregeln mit einer injizierten Clock, JDBC übernimmt die Persistenz. Auf der [Codeseite](../../code/) sind die vollständigen Klassen und Tests zugänglich. Der ursprüngliche PetClinic-Controller bleibt die getrennt erklärte Baseline. Im Explorer laufen eigene TypeScript-Übertragungen mit einem flüchtigen Speicher. Sie demonstrieren dieselben fachlichen Grenzen ohne Spring-Server; Rückgabetypen und technische Schnittstellen sind nicht identisch.

Die Demonstration hat bewusst keine echte Terminverwaltung, Anmeldung oder dauerhafte Datenbank. Ihr Zweck ist der vergleichbare Ablauf durch unterschiedliche Verantwortlichkeiten.
