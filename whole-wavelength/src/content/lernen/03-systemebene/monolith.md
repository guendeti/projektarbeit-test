---
title: "Monolith"
slug: "monolith"
lead: "Eine Anwendung, eine gemeinsame Deployment-Einheit. Ein Monolith bündelt seine Funktionen in einem ausführbaren System – und kann im Inneren trotzdem sauber strukturiert sein."
diagram: "monolith"
takeaway: "Ein Monolith besitzt eine gemeinsame Deployment-Grenze. Er muss deshalb keine schlechte interne Struktur besitzen."
sources: [petclinic, visit, microservices]
question: "Was macht eine Anwendung zum Monolithen?"
answers: [Sie besitzt grundsätzlich ungeordneten Code., Ihre wesentlichen Funktionen werden gemeinsam deployt., Sie kann nur auf einem einzigen Server laufen.]
correct: 1
explanation: "Entscheidend ist die gemeinsame Deployment-Einheit, nicht die Qualität der internen Struktur."
---
## Was ist ein Monolith?

Eine monolithische Anwendung bündelt ihre wesentlichen Funktionen in einer gemeinsamen ausführbaren Anwendung. Eine Anfrage kann innerhalb desselben Prozesses verarbeitet werden. Fachliche Teile sind nicht als unabhängig deploybare Services voneinander getrennt.

Die Bezeichnung beschreibt zunächst eine Deployment-Grenze. Packages, Komponenten, Schichten und gut gekapselte Module sind innerhalb dieser Grenze weiterhin möglich.

## Die PetClinic als Monolith

Die kanonische PetClinic ist eine Spring-Boot-Anwendung. Owners, Pets, Visits und Veterinarians sowie die Weboberfläche gehören zu derselben Anwendung. Unterhalb dieser Anwendung liegt die Datenhaltung.

```text
Browser → Spring PetClinic → Datenbank
          ├── Owners
          ├── Pets
          ├── Visits
          └── Veterinarians
```

Beim Erfassen eines Visits werden keine anderen PetClinic-Services über das Netzwerk benötigt. Der Controller kann innerhalb der Anwendung Owner und Pet laden und den Visit speichern.

## Der Visit im Original

Im kanonischen Visit-Ablauf besitzt der VisitController eine direkte Abhängigkeit zum OwnerRepository. Er lädt den Owner, bestimmt das Pet, verarbeitet die Eingabe und speichert den veränderten Owner. Eine separate Service-Schicht ist in diesem Ablauf nicht vorhanden.

```text
VisitController → Owner / Pet / Visit → OwnerRepository
```

Diese interne Struktur ist eine zusätzliche Entscheidung. Sie ist nicht die Definition eines Monolithen.

## Was ist angenehm einfach?

- Komponenten können sich über normale In-Process-Aufrufe verständigen.
- Ein gemeinsamer Build und ein Deployment können für kleine Teams übersichtlich sein.
- Ein lokaler fachlicher Ablauf braucht keine verteilten Teiltransaktionen.
- Mehrere Instanzen der gesamten Anwendung ermöglichen horizontale Skalierung.

## Wo entstehen Grenzen?

Änderungen, Veröffentlichungen und Skalierungsentscheidungen bleiben an die gesamte Anwendung gekoppelt. Wenn nur die Visit-Verarbeitung mehr Ressourcen benötigt, wird typischerweise die ganze Anwendung vervielfacht.

Ein weiteres Risiko sind unkontrollierte interne Abhängigkeiten. Wenn jedes Package auf alle anderen zugreifen darf, werden fachliche Grenzen schwer erkennbar. Das ist jedoch ein Modularisierungsproblem und keine unvermeidbare Eigenschaft des gemeinsamen Deployments.

## Wann ist der Ansatz passend?

Ein überschaubares Produkt mit einem gemeinsamen Team und eng zusammengehörigen Funktionen kann von der einfachen Betriebsstruktur profitieren. Ob das langfristig ausreicht, hängt unter anderem von Änderungsrate, Teamstruktur und fachlichen Grenzen ab.

Der nächste Schritt muss deshalb nicht sofort ein verteiltes System sein. Zunächst können wir innerhalb der gemeinsamen Anwendung explizite Modulgrenzen schaffen.
