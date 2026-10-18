---
title: "Clean Architecture"
slug: "clean-architecture"
lead: "Fachliche und anwendungsspezifische Regeln liegen innen. Frameworks und Persistenz bleiben aussen. Die Dependency Rule bestimmt, in welche Richtung der Quellcode abhängig sein darf."
diagram: "clean"
takeaway: "Der Use-Case definiert seinen benötigten Vertrag. Ein äusserer Persistenzadapter implementiert ihn – die Code-Abhängigkeit zeigt nach innen."
sources: [clean, visit]
question: "Wer kennt in unserer Clean-Variante das OwnerGateway?"
answers: [Nur die Datenbank., Der Use-Case und der äussere Adapter; der Use-Case kennt den konkreten Adapter nicht., Der Use-Case muss zwingend Spring Data kennen.]
correct: 1
explanation: "Der Vertrag gehört zum inneren Bereich. Die technische Implementierung hängt von diesem Vertrag ab."
---
## Die Dependency Rule

Robert C. Martin stellt Clean Architecture als Zusammenführung verwandter Architekturideen vor. Quellcode-Abhängigkeiten sollen zu den inneren Regeln zeigen. Der innere Code soll die äusseren technischen Mechanismen nicht kennen.

Das bekannte Bild unterscheidet Entities, Use Cases, Interface Adapters und Frameworks & Drivers. Die vier Ringe sind ein Denkmodell, keine vorgeschriebene Anzahl von Packages.

## Vier Bereiche für unseren Visit

| Bereich | PetClinic-Übertragung |
| --- | --- |
| Entities | Owner, Pet und Visit mit Fachregeln |
| Use Cases | BookVisitInteractor, Command und benötigte Verträge |
| Interface Adapters | VisitController und JpaOwnerGateway |
| Frameworks & Drivers | Spring MVC, Spring Data, Datenbank, Konfiguration |

Diese Struktur ist unsere didaktische Umsetzung und keine Beschreibung der originalen PetClinic.

## Eine explizite Eingangsgrenze

```java
public interface BookVisitUseCase {
    void bookVisit(BookVisitCommand command);
}

public record BookVisitCommand(
    int ownerId, int petId,
    LocalDate date, String description
) {}
```

Der Controller übersetzt die HTTP-Eingabe in einfache Eingabedaten. Spring-Request-Objekte wandern nicht in die Anwendungslogik.

## Der innere Persistenzvertrag

```java
public interface OwnerGateway {
    Optional<Owner> findById(int ownerId);
    void save(Owner owner);
}
```

Der Use-Case braucht Owner laden und speichern. Er definiert diesen Bedarf, ohne JPA oder eine konkrete Datenbank vorzugeben.

```java
final class BookVisitInteractor implements BookVisitUseCase {
    private final OwnerGateway owners;

    BookVisitInteractor(OwnerGateway owners) {
        this.owners = owners;
    }

    public void bookVisit(BookVisitCommand command) {
        Owner owner = owners.findById(command.ownerId())
            .orElseThrow();
        if (!command.date().isAfter(LocalDate.now())) {
            throw new InvalidVisitDateException();
        }
        owner.addVisit(command.petId(),
            new Visit(command.date(), command.description()));
        owners.save(owner);
    }
}
```

Ein äusseres `JpaOwnerGateway` implementiert den Vertrag. Technische Datentypen und Mapping bleiben in diesem Adapter. Die Konfiguration setzt die Objekte zusammen.

## Aufruf und Abhängigkeit auseinanderhalten

Zur Laufzeit ruft der Use-Case die eingesetzte Persistenzimplementierung auf. Im Quellcode kennt er ausschliesslich sein Interface. Der Adapter kennt und implementiert dieses Interface.

```text
Laufzeit: Use-Case → Adapter → Datenbank
Code:     Use-Case → Gateway ← Adapter
```

Der obere Pfeil beschreibt einen Aufruf. Der untere beschreibt statische Typ-Abhängigkeiten. Gerade diese Umkehr ist wichtiger als die gezeichnete Kreisform.

## Testbarkeit und Preis der Grenzen

Ein Test kann das Gateway durch eine In-Memory-Implementierung ersetzen. Der fachliche Ablauf benötigt dafür keinen Spring-Server. Auch ein späterer Adapterwechsel bleibt möglich, sofern der Vertrag passend geschnitten ist.

Zusätzliche Interfaces, Commands und Mapping erzeugen jedoch Aufwand. Für den kleinen Visit wird dieser besonders sichtbar. Die Struktur lohnt sich nicht automatisch in jeder Anwendung. Unser Ziel ist, ihren Mechanismus und ihren Preis nachvollziehbar zu machen.
