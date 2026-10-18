---
title: "Layered Architecture"
slug: "layered-architecture"
lead: "Die klassische horizontale Trennung: Presentation verarbeitet die Interaktion, die Anwendung koordiniert den Use-Case und Data Access übernimmt die Persistenz."
diagram: "layered"
takeaway: "Layered trennt Verantwortlichkeiten horizontal. In unserer klassischen Variante kennt der Application Service die Data-Access-Struktur unterhalb seiner Schicht."
sources: [layering, framework, visit]
question: "Warum führen wir einen BookVisitService ein?"
answers: [Um den Use-Case aus dem HTTP-Controller herauszulösen., Um automatisch einen Microservice zu erzeugen., Weil jeder Layer einen eigenen Server braucht.]
correct: 0
explanation: "Controller und Application Service erhalten getrennte Verantwortlichkeiten innerhalb derselben Anwendung."
---
## Das Grundprinzip

Eine typische Layered Architecture trennt Presentation, Business beziehungsweise Domain Logic und Data Access. In unserer klassischen Variante zeigen Abhängigkeiten von oben nach unten.

| Bestandteil | Aufgabe |
| --- | --- |
| VisitController | HTTP-Eingabe und Antwort |
| BookVisitService | Use-Case koordinieren |
| Owner, Pet, Visit | Fachliche Daten und Verhalten |
| OwnerRepository | Laden und Speichern |
| Datenbank | Technische Persistenz |

Diese Schichten sind logische Grenzen. Sie benötigen keine eigenen Prozesse.

## Unsere Refactoring-Variante

Der kanonische VisitController besitzt keine separate Service-Schicht. Wir führen sie für den Vergleich bewusst ein. Das folgende Beispiel ist unser didaktisches Refactoring; es ist kein Originalcode aus dem Repository.

```java
@Controller
class VisitController {
    private final BookVisitService service;

    VisitController(BookVisitService service) {
        this.service = service;
    }

    public String createVisit(int ownerId, int petId,
            LocalDate date, String description) {
        service.bookVisit(ownerId, petId, date, description);
        return "redirect:/owners/" + ownerId;
    }
}
```

Der Service erhält einfache Werte und benötigt kein HTTP-Request-Objekt.

```java
@Service
class BookVisitService {
    private final OwnerRepository owners;

    BookVisitService(OwnerRepository owners) {
        this.owners = owners;
    }

    public void bookVisit(int ownerId, int petId,
            LocalDate date, String description) {
        Owner owner = owners.findById(ownerId).orElseThrow();
        if (!date.isAfter(LocalDate.now())) {
            throw new InvalidVisitDateException();
        }
        owner.addVisit(petId, new Visit(date, description));
        owners.save(owner);
    }
}
```

Framework-Annotationen, Fehlerbehandlung und das Fachmodell sind hier bewusst gekürzt.

## Was haben wir gewonnen?

Der Controller muss den fachlichen Ablauf nicht mehr kennen. Der Service lässt sich ohne HTTP ansprechen. Die Verantwortlichkeiten sind in der Projektstruktur sichtbar:

```text
presentation/VisitController
application/BookVisitService
data/OwnerRepository
domain/Owner, Pet, Visit
```

Eine explizite Drei-Schichten-Struktur findet sich auch in der Spring-Framework-PetClinic-Variante. Sie darf nicht mit dem kanonischen Spring-Boot-Visit-Ablauf gleichgesetzt werden.

## Welche Abhängigkeit bleibt?

In unserem klassischen Beispiel verwendet der Service das Repository-Konzept der Datenzugriffsschicht. Damit kann die fachliche Ablaufkoordination weiterhin von technischen Typen beeinflusst werden.

```text
Controller → Service → Data Access → Datenbank
```

Layered Architecture verbietet Dependency Inversion nicht. Wir vergleichen hier bewusst die klassische Richtung. Eine geschichtete Anwendung mit inneren Interfaces kann bereits Eigenschaften von Clean oder Hexagonal erfüllen.

Auch ein Repository-Interface in einer klassischen Datenschicht kann austauschbare Implementierungen und Tests mit Ersatzobjekten ermöglichen. Für Dependency Inversion ist zusätzlich entscheidend, wem der Vertrag gehört und welche Abhängigkeiten er selbst mitbringt. Die Alternative lautet deshalb nicht „Layered ohne Interfaces“ gegen „Clean mit Interfaces“.

## Stärken und Grenzen

Der Ansatz ist leicht nachvollziehbar und reduziert den Einstieg in kleine Anwendungen. Ein Risiko sind Schichten, die nur weiterreichen, oder fachliche Logik, die zwischen Controller und Datenzugriff verstreut bleibt. Die Anzahl der Schichten allein garantiert keine gute Verantwortungsverteilung.
