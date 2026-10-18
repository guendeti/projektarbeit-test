---
title: "Modular Monolith"
slug: "modular-monolith"
lead: "Eine gemeinsam deployte Anwendung mit bewusst gesetzten fachlichen Grenzen. Der Modular Monolith trennt Module, ohne dafür zusätzliche Netzwerkprozesse einzuführen."
diagram: "modular"
takeaway: "Modularität und Verteilung sind unterschiedliche Entscheidungen. Explizite Modulgrenzen benötigen keine separaten Deployments."
sources: [modulith, petclinic-modulith, microservices]
question: "Was verändert sich gegenüber einem wenig strukturierten Monolithen?"
answers: [Jedes Modul bekommt zwingend einen eigenen Server., Die Anwendung benötigt zwingend REST., Interne fachliche Grenzen und öffentliche Schnittstellen werden explizit.]
correct: 2
explanation: "Das Deployment bleibt gemeinsam; die Struktur innerhalb der Anwendung wird verbindlicher."
---
## Vom Package zur Modulgrenze

Ein Modul fasst zusammengehörige Fachlichkeit zusammen und veröffentlicht eine definierte Schnittstelle. Andere Module sollen seine Interna nicht direkt verwenden. Ein Package-Name allein erzwingt diese Grenze noch nicht.

```text
Spring PetClinic — ein Deployment
├── owner: Owner, Pet, Visit
├── vet: Veterinarians, Specialties
└── system: gemeinsame Systemfunktionen
```

Innerhalb des Owner-Moduls können UI, Anwendungslogik, Domäne und Persistenz zusammengefasst sein. Die Module werden fachlich geschnitten, statt sämtliche Controller oder Repositories zu einem globalen technischen Modul zu machen.

## Spring Modulith als Werkzeug

Spring Modulith unterstützt logische Application Modules innerhalb einer Spring-Boot-Anwendung. Ein Modul besitzt eine sichtbare API, interne Komponenten und gegebenenfalls Abhängigkeiten zu APIs anderer Module.

Die Strukturprüfung kann beispielsweise zyklische Modulabhängigkeiten und unerlaubte Zugriffe auf Interna erkennen. Spring Modulith ist ein Werkzeug für diese Modularisierung; es ist nicht die allgemeine Definition des Architekturstils.

## Die Community-PetClinic

Die Modulith-Variante der PetClinic zeigt die Module owner, vet und system. Sie demonstriert ausserdem Kommunikation über Application Events. Beim Buchen eines Visits kann das Owner-Modul ein Ereignis veröffentlichen, auf das das Vet-Modul reagiert.

```text
owner ── VisitBooked ──▶ vet
```

Ein internes Application Event ist nicht automatisch eine Netzwerk-Nachricht. Auch sein Zustellungs- und Transaktionsverhalten muss bewusst festgelegt werden.

## Was ändert sich für den Visit?

Der Use-Case kann vollständig im Owner-Modul bleiben. Andere Module müssen seine Controller und Persistenzklassen nicht kennen. Benötigen sie eine Information, nutzen sie eine veröffentlichte API oder ein definiertes Event.

Damit liegt die fachliche Entscheidung über das Buchen dort, wo Owner, Pet und Visit zusammengehören. Die Modulgrenze schützt diesen Zusammenhang.

## Stärken und Aufwand

Die gemeinsame Betriebsstruktur bleibt erhalten. Gleichzeitig werden Verantwortlichkeiten und erlaubte Abhängigkeiten sichtbarer. Module lassen sich als fachliche Einheiten prüfen und dokumentieren.

Der Aufwand liegt im sorgfältigen Schnitt und in der Durchsetzung der Grenzen. Eine gemeinsame Datenbank kann weiterhin unerwünschte Kopplung ermöglichen. Wer fremde Tabellen oder interne Typen umgeht, untergräbt die Modul-API.

## Kein automatischer Zwischenschritt

Ein Modular Monolith muss später nicht in Microservices zerlegt werden. Er kann das passende Zielbild sein. Wenn unabhängige Deployments tatsächlich nötig werden, helfen bestehende Grenzen bei der Diskussion – sie ersetzen aber nicht die zusätzliche Arbeit an Netzwerkausfällen, Konsistenz und Betrieb.
