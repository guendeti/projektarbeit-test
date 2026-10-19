---
title: "Onion Architecture"
slug: "onion-architecture"
lead: "Die Fachdomäne bildet den stabilen Mittelpunkt. Anwendung, UI und Infrastruktur liegen darum herum; Code-Abhängigkeiten zeigen in Richtung des inneren Kerns."
diagram: "onion"
takeaway: "Die Datenbank ist ein äusseres Infrastrukturdetail. Der Domain-Kern und seine Verträge bestimmen, was die äusseren Implementierungen erfüllen müssen."
sources: [onion, clean, visit]
question: "Die Regel für zulässige Besuchsdaten ändert sich. Wo wird sie in unserem Onion-Beispiel angepasst?"
answers: ['Im gemeinsamen Fachmodell Owner und seinen Tests.', 'In JdbcOwnerRepository, weil dort Visits gespeichert werden.', 'In jedem Controller und Testadapter getrennt.']
correct: 0
explanation: "Owner.addVisit enthält die Fachregel. Sie hängt weder von einem bestimmten HTTP-Zugang noch von JDBC ab."
---
## Lernziel und fachlicher Mittelpunkt

Nach diesem Kapitel kannst du eine Fachregel vom Anwendungsablauf unterscheiden und erklären, weshalb Persistenz trotz nach innen gerichteter Code-Abhängigkeiten ausführbar bleibt.

Jeffrey Palermo stellt das Domain Model in das Zentrum der Onion Architecture. Äussere Bereiche dürfen innere verwenden; UI und Infrastruktur bleiben am Rand. Die Perspektive richtet die Aufmerksamkeit damit auf einen fachlichen Kern, der nicht von seiner Datenbank bestimmt wird. [Palermos Originalbeschreibung](../../quellen/#onion)

Unsere eigene Java-Variante verwendet denselben frameworkfreien `Owner` wie die anderen Varianten. Das kleine Modell bildet Pets über IDs und Besuchslisten ab, statt die vollständigen JPA-Entities der ursprünglichen PetClinic zu übernehmen. Wenn das Diagramm Owner, Pet und Visit nennt, beschreibt es fachliche Begriffe; nicht jeder Begriff besitzt im verkleinerten Modell eine eigene Klasse.

## Was gehört in die Domäne

`Owner.addVisit` darf einen Besuch nur einem vorhandenen Pet dieses Owners zuordnen. Es prüft ausserdem Datum und Beschreibung. Diese Regeln gelten unabhängig davon, ob eine Eingabe per HTTP, Test oder anderem Zugang erfolgt. Der tatsächliche Ausschnitt lautet:

```java source=petclinic-architectures/src/main/java/ch/zhaw/petclinic/domain/Owner.java
public void addVisit(VisitCommand command, Clock clock) {
    if (command.ownerId() != id || !pets.containsKey(command.petId()))
        throw new IllegalArgumentException("Pet gehört nicht zu diesem Owner.");
    if (command.date() == null || !command.date().isAfter(LocalDate.now(clock)))
        throw new IllegalArgumentException("Besuchsdatum muss in der Zukunft liegen.");
    String description = command.description();
    if (description == null || description.isBlank() || description.trim().length() > 255)
        throw new IllegalArgumentException("Beschreibung muss 1 bis 255 Zeichen enthalten.");
    pets.get(command.petId()).add(new Visit(command.date(), description.trim()));
}
```

Die Mutation erfolgt erst nach den Prüfungen. Das Trimmen der Beschreibung ist eine eigene Lehrbeispiel-Regel. Die übergebene `Clock` macht den zeitlichen Bezug ausdrücklich prüfbar. Sie ist ein Java-Standardtyp und keine Spring-Abhängigkeit.

Wir geben hier einen einfachen `VisitCommand` an das Fachmodell weiter. Dieser Datenträger enthält keine HTTP-, Spring- oder JDBC-Typen und liegt im gemeinsamen Domain-Package. Bei komplexeren Anwendungsbefehlen wäre zu prüfen, ob die Domäne stattdessen fachliche Einzelwerte oder eigene Wertobjekte erhalten soll. Die Vereinfachung ist keine allgemeine Vorgabe.

## Was übernimmt der Application Service

`BookVisitService` lädt den Owner, ruft dessen fachliches Verhalten auf und speichert das Ergebnis. Er entscheidet, in welcher Reihenfolge diese Schritte stattfinden. Wie die Beschreibung geprüft wird, muss er nicht nochmals implementieren.

Für diesen Ablauf reicht eine Methode des vorhandenen Fachobjekts. Ein zusätzlicher Domain Service würde im Beispiel keine eigenständige fachliche Verantwortung übernehmen. Er wäre eher zu diskutieren, wenn eine Regel mehrere fachliche Objekte betrifft und keinem davon sinnvoll zugeordnet werden kann. Mehr Ringe oder Services sind kein Selbstzweck.

Der Service liegt um die Domäne herum. Sein benötigter Persistenzvertrag gehört zum inneren Anwendungsbereich:

```java source=petclinic-architectures/src/main/java/ch/zhaw/petclinic/onion/application/OwnerRepository.java
public interface OwnerRepository {
    Optional<Owner> findById(int id);
    void save(Owner owner);
}
```

Der Vertrag spricht über das eigene Fachmodell. Ein SQL-Ergebnisobjekt oder eine Spring-Data-Basisklasse würde technische Abhängigkeiten nach innen bringen. Die genaue Platzierung eines solchen Vertrags ist eine Entwurfsentscheidung; unser Beispiel legt ihn neben den Anwendungsservice. Das Ringbild schreibt keinen bestimmten Java-Package-Namen vor.

## Warum die Datenbank trotzdem aufgerufen wird

`JdbcOwnerRepository` liegt in der äusseren Infrastruktur und implementiert das innere Interface. Die Konfiguration injiziert seine Instanz in den Service. Deshalb sind beide Aussagen gleichzeitig richtig:

```text
Laufzeit: BookVisitService → eingesetztes JdbcOwnerRepository
Code:     BookVisitService → OwnerRepository ← JdbcOwnerRepository
```

Die Anwendung ruft ein konkretes Objekt über einen inneren Typ auf. Nach innen gerichtete Code-Abhängigkeiten verbieten keine Speicherung. Die HTTP-Transaktion und der gemeinsame JDBC-Speicher liegen ausserhalb der Domäne; dort wird auch zwischen Tabellen und Fachmodell übersetzt.

## Zwei Änderungen am selben Beispiel

Eine geänderte Datumsregel betrifft `Owner` und dessen Prüfungen. Der JDBC-Adapter muss die Regel nicht kennen. Ein Austausch der Persistenz betrifft dagegen den Adapter und die Verdrahtung, solange der innere Vertrag fachlich unverändert bleibt. Bei beiden Änderungen sind Integration und Fehlerverhalten weiterhin zu prüfen.

`CoreWithoutFrameworkTest` kontrolliert mit fester Uhr und einem Speicherersatz, dass der gültige Visit beim richtigen Pet landet und ein heutiges Datum nicht gespeichert wird. Die HTTP-/H2-Tests ergänzen den tatsächlichen technischen Pfad. Die ArchUnit-Regeln prüfen ausgewählte Abhängigkeiten; keine dieser Prüfungen garantiert allein die Angemessenheit des Domain-Modells. [Java-Dateien und Test ansehen](../../code/#java-core-test)

## Gemeinsamkeiten und begrenzte Aussagekraft

Clean betont Regeln und Use-Cases, Hexagonal Interaktionen über Ports, Onion die fachliche Mitte. In unserem kleinen Visit führen diese Blickwinkel zu sehr ähnlichem Code. Eine Codebasis kann mehrere dieser Beschreibungen erfüllen. Ein zusätzlicher Domain Service oder ein anderer Repository-Name würde keine künstliche Trennlinie rechtfertigen.

Die Domäne ist bewusst überschaubar. Daraus lassen sich die Richtung von Abhängigkeiten und die Platzierung von Verantwortung erklären. Aussagen über die langfristige Wartbarkeit einer grossen Kliniksoftware wären damit nicht belegt.

## Transferaufgabe

Die Beschreibung soll künftig höchstens 120 Zeichen enthalten. Ein Vorschlag prüft dies ausschliesslich im REST-Controller. Welches Problem entsteht beim direkten Aufruf aus einem Test oder einem späteren zweiten Eingang?

<details>
<summary>Lösung und Begründung anzeigen</summary>
<p>Der direkte Eingang würde die Prüfung umgehen. Die gemeinsame fachliche Grenze muss daher in Owner.addVisit angepasst und mit zulässigen und unzulässigen Längen geprüft werden. Der Controller kann zusätzlich eine frühe Rückmeldung geben, ist aber nicht die einzige Absicherung. Die Zahl 120 ist ein hypothetisches Änderungsszenario; die ausführbare Referenz verwendet weiterhin 255 Zeichen.</p>
</details>
