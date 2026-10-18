---
title: "Die Spring PetClinic kennenlernen"
slug: "spring-petclinic"
lead: "Die Spring PetClinic ist eine Open-Source-Beispielanwendung aus dem Spring-Ökosystem. Sie bildet grundlegende Verwaltungsaufgaben einer Tierarztpraxis ab und liefert unsere gemeinsame Fachdomäne."
diagram: "petclinic"
takeaway: "Die PetClinic verbindet unseren Lernpfad. Im kanonischen Visit-Ablauf wird ein Besuch einem Pet zugeordnet, aber kein bestimmter Vet ausgewählt. Community-Varianten können zusätzliche Funktionen besitzen."
sources: [petclinic, visit, visit-model, petclinic-schema, framework, petclinic-modulith, petclinic-microservices]
question: "Welche Aussage gilt für den kanonischen Visit-Ablauf?"
answers: ['Für jeden Visit wird ein bestimmter Vet ausgewählt.', 'Ein Visit wird einem Pet mit Datum und Beschreibung zugeordnet.', 'Jeder Visit benötigt einen separaten Microservice.']
correct: 1
explanation: "Das Original ordnet den Visit einem Pet zu. Eine Auswahl eines bestimmten Tierarztes gehört nicht zu diesem Ablauf."
---
## Eine Anwendung als gemeinsames Beispiel

Die kanonische Implementierung im Repository **spring-projects/spring-petclinic** verwendet Spring Boot und Thymeleaf. Sie enthält Weboberfläche, Anwendungsfunktion und Persistenz in einer gemeinsam gestarteten Anwendung.

Die Fachdomäne ist überschaubar. Ausserdem existieren Community-Varianten mit anderen Strukturen. Das macht die PetClinic zu einem geeigneten Lernbeispiel für den Vergleich von Architekturentscheidungen.

## Die wichtigsten Fachobjekte

| Objekt | Bedeutung | Beispiel |
| --- | --- | --- |
| Owner | Tierhalter mit einem oder mehreren Haustieren | Lea Keller |
| Pet | Haustier, das einem Owner zugeordnet ist | Milo, eine Katze |
| Visit | Erfasster Besuch eines Pets mit Datum und Beschreibung | Vorsorgeuntersuchung |
| Vet | Tierarzt, gegebenenfalls mit Fachgebieten | Dr. Meier |

Ein Owner kann mehrere Pets besitzen. Ein Pet kann wiederum mehrere Visits haben.

**Wichtig:** Vet gehört zur Fachdomäne. Im hier untersuchten kanonischen Visit-Use-Case wird jedoch kein bestimmter Vet zugewiesen. Das Visit-Modell und die zugehörige Tabelle enthalten keine solche Zuordnung.

## Welche Funktionen bietet die PetClinic?

Die Anwendung ermöglicht insbesondere die Suche und Verwaltung von Tierhaltern, die Verwaltung ihrer Haustiere, das Erfassen von Besuchen sowie das Anzeigen von Tierärzten.

Die Bedienung erfolgt über eine Weboberfläche. Um einen Visit zu erfassen, wird zunächst ein Owner gesucht. Auf dessen Detailseite wird beim gewünschten Pet das Formular für einen neuen Visit geöffnet. Nach einer gültigen Eingabe speichert die Anwendung den Besuch und kehrt zur Detailansicht des Owners zurück.

## Unser gemeinsamer Use-Case

Lea erfasst für Milo einen Besuch mit Datum und Beschreibung. Die Anwendung bestimmt Owner und Pet, prüft die Eingabe und speichert den Visit.

Wir nennen das **„Besuch erfassen“**. Der betrachtete Originalablauf enthält keine vollständige Terminplanung mit Uhrzeit, freien Kapazitäten oder einer auswählbaren Tierärztin beziehungsweise einem auswählbaren Tierarzt.

Auf der Codeebene verwenden unsere eigenen Lehrbeispiele immer diesen fachlichen Kern. So werden Veränderungen der Verantwortlichkeiten und Abhängigkeiten sichtbar.

## Original, Community-Variante oder eigener Entwurf?

| Variante | Rolle in dieser Microsite |
| --- | --- |
| Kanonische Spring PetClinic | Ausgangspunkt für Monolith und Visit-Ablauf |
| Spring Framework PetClinic | Referenz für eine explizite Service-Schicht |
| PetClinic Modulith | Community-Beispiel für fachliche Module und Events |
| PetClinic Microservices | Community-Beispiel für verteilte Services |
| SCS-PetClinic | Eigener konzeptioneller Entwurf |
| Layered, Clean, Hexagonal und Onion hier | Eigene didaktische Refactorings des Visit-Kerns |

Die realen Varianten sind nicht funktionsgleich. Die betrachtete Modulith-Variante ergänzt beispielsweise nach einem VisitBooked-Event eine Tierarztzuweisung. Das ist zusätzliche Fachfunktion und keine notwendige Eigenschaft eines Modular Monolith.

## Was unsere Beispiele vereinfachen

Im Explorer verwenden wir fiktive Daten und einen In-Memory-Speicher im Browser. Die Beispiele sind ausführbar, aber keine vollständigen Spring-Anwendungen. Sie demonstrieren gezielt Architekturgrenzen.

Die Referenzen verlinken Originalquellen. Aussagen zum Repository-Verhalten beziehen sich auf den jeweils dokumentierten Quellstand; spätere Änderungen am Hauptbranch können davon abweichen.
