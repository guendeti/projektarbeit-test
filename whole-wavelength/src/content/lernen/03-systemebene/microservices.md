---
title: "Microservices"
slug: "microservices"
lead: "Aus fachlichen Grenzen werden eigenständig laufende und deploybare Services. Das schafft Unabhängigkeit – und macht aus lokalen Aufrufen verteilte Kommunikation."
diagram: "microservices"
takeaway: "Microservices schaffen separate Prozess- und Deployment-Grenzen. Die zusätzliche Unabhängigkeit bringt Netzwerk-, Integrations- und Betriebsaufwand mit sich."
sources: [microservices, petclinic-microservices, visit]
question: "Welche neue Herausforderung entsteht an einer Service-Grenze?"
answers: [Ein Aufruf kann durch Netzwerkprobleme oder einen nicht verfügbaren Service scheitern., Java-Interfaces werden unmöglich., Jeder Service muss dieselbe interne Architektur verwenden.]
correct: 0
explanation: "Ein Remote Call ist kein lokaler Methodenaufruf; Fehler, Latenz und Verfügbarkeit müssen berücksichtigt werden."
---
## Von Modulen zu Services

Ein Microservice ist ein separat laufender, unabhängig deploybarer Teil eines Systems. Der Schnitt orientiert sich typischerweise an fachlichen Fähigkeiten. Zwischen den Services liegen Prozess- und Netzwerkgrenzen.

Der wesentliche Unterschied zum Modular Monolith ist deshalb nicht ein anderer Ordnername. Ein lokaler Aufruf wird gegebenenfalls zu einer Anfrage über das Netzwerk.

## Die verteilte PetClinic

Die Spring-Cloud-Variante der Community enthält unter anderem:

| Teil | Verantwortung |
| --- | --- |
| Customers Service | Kunden- und Pet-Daten |
| Visits Service | Visits |
| Vets Service | Veterinärdaten |
| API Gateway | Einstieg und Weiterleitung von Anfragen |
| Config / Discovery | Technische Infrastruktur |

Die Variante beschreibt REST-Kommunikation. Weitere ergänzende Komponenten, etwa ein GenAI Service, sind für unseren Vergleich des klassischen PetClinic-Kerns ausgeblendet.

## Was passiert mit unserem Visit?

Im Monolithen kann der VisitController im selben Prozess mit Owner, Pet und Repository arbeiten. In der verteilten Variante liegen Kunden-/Pet-Daten und Visits in unterschiedlichen Services.

Benötigt ein Ablauf Daten aus beiden Bereichen, muss die Architektur eine Integrationsentscheidung treffen: synchron nachfragen, Informationen replizieren oder Ereignisse verwenden. Das Übersichtsdiagramm zeigt den Service-Schnitt und behauptet keine zwingende Aufrufkette zwischen allen drei Services.

```text
Vorher: lokaler Zugriff auf Owner und Pet
Nachher: fachliche Information liegt eventuell in einem anderen Prozess
```

## Was gewinnen wir?

Unabhängige Deployments können Änderungen eines Services von Releases anderer Services entkoppeln. Einzelne Teile können gezielter skaliert werden. Klare Service-Verträge unterstützen die Verantwortung eigenständiger Teams.

Diese Eigenschaften entstehen nicht allein durch mehrere Prozesse. Wenn alle Services bei jeder Änderung gleichzeitig angepasst werden müssen, bleibt starke Kopplung bestehen.

## Was bezahlen wir dafür?

- Netzwerkaufrufe haben Latenz und können teilweise scheitern.
- Verteilte Daten erschweren atomare Änderungen über Grenzen hinweg.
- APIs müssen kompatibel weiterentwickelt werden.
- Logs, Traces, Monitoring und Deployment brauchen zusätzliche Mechanismen.
- Lokale Entwicklung und Integrationstests können aufwendiger werden.

Es entsteht keine Fortschrittsleiter von „schlecht“ zu „gut“. Ein Monolith reduziert verteilte Komplexität; Microservices ermöglichen mehr Deployment-Unabhängigkeit. Die passende Wahl hängt vom konkreten Bedarf ab.

## Innen bleibt eine zweite Entscheidung

Ein Visits Service kann intern Layered, Clean, Hexagonal oder Onion verwenden. Seine Service-Grenze beantwortet noch nicht, wie seine Klassen organisiert sind. Genau dort beginnt später die Codeebene.
