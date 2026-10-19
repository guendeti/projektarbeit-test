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

Eine typische Layered Architecture trennt Presentation, Business beziehungsweise Domain Logic und Data Access. Die Schichten sind logische Grenzen und benötigen keine getrennten Prozesse. [Fowlers Beschreibung der Schichten](../../quellen/#layering)

| Bestandteil | Aufgabe in unserer Referenz |
| --- | --- |
| VisitController | HTTP-Eingabe und Antwort |
| BookVisitService | Use-Case koordinieren |
| Owner und Visit | Fachliche Daten und Verhalten |
| OwnerRepository | Laden und Speichern über JDBC |

Der kanonische VisitController besitzt keine separate Service-Schicht. Wir führen sie für den Vergleich bewusst ein. Die folgenden Ausschnitte entsprechen unserer ausführbaren Java-Variante, nicht dem Originalcode der PetClinic.

## Der Service koordiniert den gemeinsamen Ablauf

```java source=petclinic-architectures/src/main/java/ch/zhaw/petclinic/layered/application/BookVisitService.java
public void bookVisit(VisitCommand command) {
    Owner owner = owners.findById(command.ownerId())
        .orElseThrow(() -> new NoSuchElementException("Owner nicht gefunden."));
    owner.addVisit(command, clock);
    owners.save(owner);
}
```

Der Controller erzeugt `VisitCommand` aus Route und JSON und ruft den Service auf. Die Fachregeln liegen in `Owner.addVisit`; die injizierte `Clock` macht die Datumsprüfung reproduzierbar. Der Service verarbeitet selbst keine HTTP-Objekte und verwendet keine Spring-Annotation. Die äussere Konfiguration setzt die Instanzen zusammen.

Diese Aufgabentrennung verwenden auch die anderen drei Java-Varianten. Beim Vergleich bleibt deshalb die Fachlichkeit konstant. Eine explizite Service-Schicht findet sich ausserdem in der Spring-Framework-PetClinic; sie ist eine andere Referenz als der kanonische Spring-Boot-Visit. [Community-Variante](../../quellen/#framework)

## Welche Abhängigkeit bleibt

Der Service kennt in unserem Beispiel die konkrete `OwnerRepository`-Klasse im Datenzugriffs-Package. Sie delegiert an den gemeinsamen JDBC-Speicher. Das folgende Bild zeigt die Verwendung der Verantwortlichkeiten, nicht eine Verteilung auf Server:

```text
Controller → Service → Data Access → Datenbank
                 ↓
          Fachmodell Owner
```

Bei Clean wird der benötigte Persistenzvertrag dagegen im inneren Anwendungsbereich definiert und von einem äusseren Adapter implementiert. Der entscheidende Unterschied liegt in der Code-Abhängigkeit und dem Besitz des Vertrags.

Layered verbietet solche inneren Verträge oder Dependency Inversion nicht. Auch klassische Repository-Interfaces erlauben Ersatzimplementierungen. Wir vergleichen hier ausdrücklich diese konkrete äussere Repository-Abhängigkeit und nicht „Layered ohne Interfaces“ mit „Clean mit Interfaces“.

## Stärken und Grenzen

Wenige erkennbare Rollen erleichtern den Einstieg. Zusätzliche Services, die ausschliesslich weiterreichen, können dagegen unnötige Struktur erzeugen. Für den kleinen Visit ist die Layered-Variante eine legitime Lösung. Ihre Aussagekraft endet dort, wo aus einer gewählten Referenz pauschal schlechtere Testbarkeit oder Wartbarkeit abgeleitet würde.

Im nächsten Kapitel verfolgen wir denselben Ablauf mit einem inneren Persistenzvertrag. Die Dateien aller Varianten und die gemeinsame Domäne stehen im [Codebereich](../../code/#java-domain).
