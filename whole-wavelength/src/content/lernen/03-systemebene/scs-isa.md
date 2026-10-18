---
title: "Self-contained Systems & ISA"
slug: "scs-isa"
lead: "Ein Self-contained System umfasst einen vollständigen fachlichen Ausschnitt mit eigener Oberfläche, Logik und Daten. ISA ergänzt Prinzipien für die Unabhängigkeit und den gemeinsamen Betrieb solcher Systeme."
diagram: "scs"
takeaway: "SCS beschreibt autonome fachliche Webanwendungen. ISA formuliert systemweite Regeln. Die interne Codearchitektur bleibt eine separate Entscheidung."
sources: [scs, isa, microservices]
question: "Was ist für ein Self-contained System charakteristisch?"
answers: ['Es bietet ausschliesslich eine REST-API.', 'Es enthält eigene UI, Fachlogik und Daten.', 'Es teilt zwingend alle Tabellen mit anderen Systemen.']
correct: 1
explanation: "Ein SCS bildet einen vertikalen, für Benutzer nutzbaren fachlichen Ausschnitt."
---
## Ein vollständiger fachlicher Ausschnitt

Ein Self-contained System ist eine autonome Webanwendung. Für seinen fachlichen Bereich enthält es Daten, Logik und die benötigte Benutzeroberfläche. Seine wesentlichen Use-Cases sollen möglichst ohne die gleichzeitige Verfügbarkeit anderer Systeme funktionieren. Eine klare Teamverantwortung gehört ebenfalls zum Konzept.

Ein SCS ist daher nicht einfach ein grösserer Backend-Microservice. Seine Grenze umfasst eine nutzbare Fachfunktion über die technischen Schichten hinweg. Wo sinnvoll, werden Abhängigkeiten zwischen SCS asynchron gestaltet; die Integration kann auch über Links und die Benutzeroberfläche erfolgen.

Die Begriffe sind keine ausschliessenden Kategorien: Auch Microservices können UI-Verantwortung umfassen. Ein SCS kann intern aus mehreren Microservices bestehen. Entscheidend für SCS sind sein nutzbarer fachlicher Ausschnitt und seine Autonomie, nicht allein eine zusätzliche Oberfläche.

## Unser PetClinic-Entwurf

**Die folgende Aufteilung ist unser konzeptioneller Entwurf. Sie ist keine offizielle PetClinic-Variante.**

Wir gruppieren Owner, Pet und Visit in einer Patientenverwaltung. Sie enthält ihre Weboberfläche, ihre Fachlogik und ihre Datenhaltung. Eine Veterinärverwaltung verwaltet Vets und Specialties ebenfalls mit eigener Oberfläche und Datenhaltung.

Der Kernablauf „Visit für Pet erfassen“ bleibt vollständig in der Patientenverwaltung:

```text
Owner laden → Pet bestimmen → Visit prüfen → speichern
```

Für diesen Ablauf wird kein synchroner Aufruf der Veterinärverwaltung benötigt. Informationen für andere Systeme können als Ereignis veröffentlicht werden. Dabei müssen Aktualität, Wiederholungen und Zustellungsfehler bewusst behandelt werden.

## Was bedeutet ISA?

Independent Systems Architecture ist eine Sammlung von Prinzipien für weitgehend unabhängige Module beziehungsweise Systeme. Sie ist keine weitere konkrete PetClinic-Deploymentform. Die neun Prinzipien lassen sich so auf unsere verteilte PetClinic übertragen:

| Prinzip | Übertragung auf PetClinic |
| --- | --- |
| Module besitzen Schnittstellen | Kein Zugriff auf fremde interne Datenstrukturen |
| Macro- und Micro-Architektur trennen | Gemeinsame Integrationsregeln, freie interne Struktur |
| Module separat ausführen | Eigene Prozesse oder Container |
| Kommunikation standardisieren | Vereinbarte REST- oder Messaging-Mechanismen |
| Metadaten standardisieren | Einheitliche Authentifizierungs- und Trace-Informationen |
| Eigene Delivery-Pipeline | Build, Tests und Deployment je Einheit |
| Betrieb standardisieren | Gemeinsame Regeln für Logging, Monitoring und Konfiguration |
| Standards an Schnittstellen erzwingen | Verträge prüfen, interne Technologie offenlassen |
| Resilienz | Mit Ausfällen und unerwarteten Neustarts umgehen |

Die Tabelle fasst die Prinzipien zusammen. Die Original-Spezifikation unterscheidet verbindliche Anforderungen (must) und Empfehlungen (should): Insbesondere Betriebsstandardisierung und die Durchsetzung von Standards an Schnittstellen sind Empfehlungen. ISA lässt ausserdem synchronen, asynchronen und UI-basierten Integrationen Raum; das ist nicht identisch mit der SCS-Empfehlung, synchrone Abhängigkeiten im eigenen Anfragezyklus zu vermeiden.

## Macro und Micro Architecture

Die Macro Architecture definiert systemweite Regeln: Welche Systeme gibt es? Wie kommunizieren sie? Welche Metadaten und Betriebsstandards gelten?

Die Micro Architecture betrifft die interne Gestaltung einer Einheit. Unsere Patientenverwaltung kann beispielsweise hexagonal aufgebaut sein, während die Veterinärverwaltung klassische Schichten verwendet. Das bedeutet nicht, dass Teamentscheidungen grenzenlos frei sind: Die vereinbarten Schnittstellen bleiben verbindlich.

## Die Systemebene im Vergleich

| Kriterium | Monolith | Modular Monolith | Microservices | SCS |
| --- | --- | --- | --- | --- |
| Deployment | Gemeinsam | Gemeinsam | Mehrere | Mehrere |
| Grenzen | Intern möglich | Explizite Module | Services | Fachliche Systeme |
| Interne Netzwerkaufrufe | Nicht nötig | Nicht nötig | Zwischen Services | Zwischen SCS |
| Eigene UI je Teil | Nicht erforderlich | Nicht erforderlich | Nicht erforderlich | Charakteristisch |
| PetClinic-Beispiel | Original | Community-Modulith | Community-Microservices | Unser Entwurf |

## Stärken und Abwägung

Ein vertikaler Schnitt kann die fachliche und organisatorische Autonomie stärken. Er verlangt aber bewusst gewählte Grenzen. Replizierte Daten, asynchrone Aktualisierung und mehrere Oberflächen bringen eigene Gestaltungsfragen mit sich.

Die entscheidende Frage lautet: Kann ein Team seine wesentliche Fachfunktion unabhängig liefern und betreiben? Ein Netzwerkdiagramm allein beantwortet sie noch nicht.
