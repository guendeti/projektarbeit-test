---
title: "Die Spring PetClinic kennenlernen"
slug: "spring-petclinic"
lead: "Eine kleine Tierarztpraxis liefert uns die gemeinsame Fachdomäne. Owner, Pet, Visit und Vet bleiben dieselben – unabhängig davon, wie wir die Software organisieren."
diagram: "petclinic"
takeaway: "PetClinic ist unsere fachliche Konstante. Das Original, Community-Varianten und eigene Architekturentwürfe werden bewusst auseinandergehalten."
sources: [petclinic, visit, framework, petclinic-modulith, petclinic-microservices]
question: "Was bleibt in unserem Architekturvergleich konstant?"
answers: [Die Anzahl aller Interfaces., Die Deployment-Struktur., Der Use-Case „Visit für ein Pet erfassen“.]
correct: 2
explanation: "Gleiche Fachlichkeit macht strukturelle Unterschiede zwischen den Architekturen sichtbar."
---
## Vier Begriffe für die Tierarztpraxis

| Begriff | Bedeutung | Beispiel |
| --- | --- | --- |
| Owner | Tierhalterin oder Tierhalter | Lea Keller |
| Pet | Ein Tier eines Owners | Milo, eine Katze |
| Visit | Besuch beziehungsweise Behandlungstermin | Vorsorgeuntersuchung |
| Vet | Tierärztin oder Tierarzt | Dr. Meier |

Ein Owner kann mehrere Pets besitzen. Ein Pet kann mehrere Visits haben. Die Veterinärverwaltung enthält zusätzliche Informationen wie Fachgebiete. Für unseren Visit-Vergleich benötigen wir hauptsächlich Owner, Pet und Visit.

## Die kanonische Anwendung

Das Repository **spring-projects/spring-petclinic** ist die kanonische Spring-Boot-/Thymeleaf-Implementierung. Es enthält Weboberfläche, Anwendungsfunktion und Persistenz in einer gemeinsam gestarteten Anwendung.

Die PetClinic ist ein Lern- und Demonstrationsprojekt. Ihr kompakter Umfang macht Beziehungen sichtbar, die in einer grossen Unternehmensanwendung durch viele zusätzliche Funktionen verdeckt wären.

## Ein Beispiel, mehrere Varianten

| Variante | Rolle in dieser Microsite |
| --- | --- |
| Kanonische Spring PetClinic | Ausgangspunkt für Monolith und Visit-Ablauf |
| Spring Framework PetClinic | Referenz für eine explizite Service-Schicht |
| PetClinic Modulith | Reales Community-Beispiel für fachliche Module |
| PetClinic Microservices | Reales Community-Beispiel für verteilte Services |
| SCS-PetClinic | Eigener konzeptioneller Entwurf |
| Clean, Hexagonal und Onion hier | Eigene didaktische Refactorings |

Die eigenen Varianten sind keine Behauptung über den Aufbau des Original-Repositories. Ihre Aufgabe ist, die Prinzipien anhand derselben Fachfunktion nachvollziehbar zu machen.

## Unser roter Faden

Lea möchte für ihre Katze Milo einen Besuch buchen. Die Anwendung erhält Owner-ID, Pet-ID, Datum und Beschreibung. Sie findet das Tier, prüft die Eingabe und speichert den Visit.

```text
ownerId:     1
petId:       1
date:        ein zukünftiger Tag
description: Vorsorgeuntersuchung
```

Die Beispieldaten sind fiktiv. Der Explorer speichert nichts auf einem Server: Er führt die Demonstration im Browser aus.

## Was wir bewusst vereinfachen

Wir lassen Anmeldung, Abrechnung und reale Terminverfügbarkeit weg. Auch die Diagramme zeigen nicht jedes Framework-Detail. So vergleichen wir Verantwortlichkeiten und Abhängigkeiten, ohne fachlich unterschiedliche Produkte zu erfinden.

Die Repositories entwickeln sich weiter. Die Quellen führen zu den Originalprojekten; für reproduzierbare wissenschaftliche Aussagen sollte zusätzlich ein untersuchter Commit oder Tag festgehalten werden.
