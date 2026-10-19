---
title: "Clean Architecture"
slug: "clean-architecture"
lead: "Fachliche Regeln und der Use-Case liegen innen. Am ausführbaren Java-Beispiel verfolgen wir einen Visit, ohne den Kern an Spring oder JDBC zu binden."
diagram: "clean"
takeaway: "Der Use-Case definiert seinen benötigten Vertrag. Ein äusserer Persistenzadapter implementiert ihn – die Code-Abhängigkeit zeigt nach innen."
sources: [clean, visit]
question: "Der BookVisitInteractor verwendet plötzlich JdbcTemplate direkt. Was bedeutet das für unsere Clean-Variante?"
answers: ['Die zusätzliche Klasse ändert nur die Laufzeitansicht.', 'Der innere Use-Case hängt von einem äusseren technischen Detail ab und verletzt die gewählte Grenze.', 'Die Grenze bleibt erhalten, solange der Controller ein Interface verwendet.']
correct: 1
explanation: "Die Dependency Rule gilt auch im Use-Case. Ein Eingangsinterface gleicht eine technische Abhängigkeit im Kern nicht aus."
---
## Lernziel und Grundprinzip

Nach diesem Kapitel kannst du den Visit vom Controller bis zur Speicherung verfolgen, Fachregel und Ablaufkoordination unterscheiden und eine unerlaubte technische Abhängigkeit im Kern erkennen.

Robert C. Martin unterscheidet Entities, Use Cases, Interface Adapters sowie Frameworks and Drivers. Seine Dependency Rule richtet Quellcode-Abhängigkeiten auf die inneren Regeln aus. Die Kreisform ist ein Denkmodell; sie schreibt weder vier Packages noch bestimmte Klassennamen vor. [Originalbeschreibung von Martin](../../quellen/#clean)

Wir übertragen diese Perspektive auf unseren abgegrenzten Visit. Die folgenden Ausschnitte stammen aus dem **ausführbaren Java-Lehrausschnitt**. Imports und umgebende Klassen sind bei Methodenausschnitten weggelassen; Zeilenumbrüche sind angepasst. Der kanonische PetClinic-Controller bleibt die separate Baseline. Die Browser-Demo verwendet dieselben fachlichen Regeln, aber TypeScript und einen flüchtigen Speicher.

## Vom HTTP Eingang zum inneren Vertrag

Der äussere `VisitController` liest Owner- und Pet-ID aus der Route sowie Datum und Beschreibung aus JSON. Er baut daraus `VisitCommand`. HTTP-Typen gelangen nicht in den Use-Case. Sein Eingangsvertrag lautet:

```java source=petclinic-architectures/src/main/java/ch/zhaw/petclinic/clean/application/BookVisitUseCase.java
public interface BookVisitUseCase {
    void bookVisit(VisitCommand command);
}
```

Der `BookVisitInteractor` implementiert diesen Vertrag. Er lädt den Owner, lässt das Fachmodell den Besuch hinzufügen und speichert das Ergebnis:

```java source=petclinic-architectures/src/main/java/ch/zhaw/petclinic/clean/application/BookVisitInteractor.java
public void bookVisit(VisitCommand command) {
    Owner owner = owners.findById(command.ownerId())
        .orElseThrow(() -> new NoSuchElementException("Owner nicht gefunden."));
    owner.addVisit(command, clock);
    owners.save(owner);
}
```

Diese Methode koordiniert den Anwendungsfall. Die Regel, dass das Datum strikt nach heute liegen muss, wird dagegen in `Owner.addVisit` geprüft. Dort werden auch Pet-Zugehörigkeit und Beschreibung validiert. Alle vier Java-Varianten teilen dieses Fachmodell. Die Platzierung der Regeln bleibt beim Vergleich konstant.

## Wer besitzt den Persistenzvertrag

Die Variable `owners` hat den Typ `OwnerGateway`. Dieses Interface gehört zum inneren Application-Package:

```java source=petclinic-architectures/src/main/java/ch/zhaw/petclinic/clean/application/OwnerGateway.java
public interface OwnerGateway {
    Optional<Owner> findById(int id);
    void save(Owner owner);
}
```

Der Vertrag formuliert, was der Use-Case benötigt. Er enthält weder SQL noch Spring-Data-Typen. Der äussere `JdbcOwnerGateway` implementiert ihn und delegiert an `OwnerJdbcStorage`. Die ausgeführte Referenz verwendet **JDBC und H2**, nicht einen hypothetischen JPA-Adapter. Den vollständigen [Adapter und die Verdrahtung](../../code/#java-clean-adapter) kannst du im Codebereich nachlesen.

Zur Laufzeit führt die eingesetzte Adapterinstanz den Ladeaufruf aus. Im Quellcode kennt der Interactor nur den inneren Vertrag:

```text
Laufzeit: Controller → Interactor → JDBC-Adapter → Speicher
Code:     Interactor → OwnerGateway ← JdbcOwnerGateway
```

Ein Interface ist keine zusätzliche ausführende Station. Die Aufrufrichtung nach aussen widerspricht deshalb nicht der Code-Abhängigkeit nach innen.

## Verdrahtung und bewusste Vereinfachungen

`VisitConfiguration` erzeugt Adapter und Interactor und injiziert eine `Clock`. Die Uhr bleibt im Test fest einstellbar; ein Test hängt dadurch nicht vom heutigen Kalenderdatum ab. Die Spring-Konfiguration liegt aussen, der Interactor trägt keine Spring-Annotation.

Die Transaktion beginnt im Beispiel am HTTP-Einstieg. Ein weiterer Eingang mit echter Datenbank müsste ebenfalls eine passende äussere Transaktionsgrenze erhalten. Ein frameworkfreier Kern allein garantiert keine atomare Speicherung.

Eine separate Output Boundary mit Presenter führen wir hier nicht ein. Der kleine Use-Case liefert keinen aufbereiteten Ergebnisdatensatz zurück; der Controller antwortet bei Erfolg mit HTTP 201, Fehler werden aussen übersetzt. Bei komplexer Ergebnisdarstellung wäre diese Grenze neu zu prüfen. Das ist eine Begrenzung unseres Beispiels, keine vollständige Darstellung aller Clean-Ausprägungen.

## Eine Änderung konkret beurteilen

Soll die Speicherung ersetzt werden, bleibt der Interactor unverändert, solange der innere Vertrag und seine fachliche Bedeutung erhalten bleiben. Angepasst werden Adapter, Mapping und Konfiguration. Der Wechsel ist nicht kostenlos: Transaktionen, Fehlerverhalten und Integration müssen weiterhin geprüft werden.

Ändert sich dagegen die Regel für Besuchsdaten, betrifft das im Beispiel `Owner` und die Fachtests. Diese Änderung ist kein Anlass, SQL in den Interactor zu verlagern. Ein `JdbcTemplate`-Import dort wäre eine Verletzung der gewählten Grenze und wird durch die vorhandene ArchUnit-Regel gegen technische Abhängigkeiten innerer Packages erfasst.

`CoreWithoutFrameworkTest` führt den Use-Case ohne HTTP, Spring und Datenbank mit einem In-Memory-Ersatz aus. Er prüft einen gültigen Besuch und dass ein heutiges Datum keinen Speicheraufruf auslöst. Diese Prüfung macht eine konkrete Eigenschaft der Grenzen sichtbar, belegt aber keine allgemein bessere Wartbarkeit. [Test ansehen](../../code/#java-core-test)

## Transferaufgabe

Ein neues Formular soll denselben Visit erfassen. Müssen die Datumsprüfung und `OwnerGateway` dafür ein zweites Mal geschrieben werden? Begründe, welche Teile hinzukommen und welche unverändert bleiben.

<details>
<summary>Lösung und Begründung anzeigen</summary>
<p>Der neue äussere Adapter übersetzt seine Eingabe in VisitCommand und ruft BookVisitUseCase auf. Interactor, Gateway und Fachmodell bleiben bestehen. Beim weiteren Eingang sind Verdrahtung, Fehlerübersetzung und gegebenenfalls Transaktionsgrenze bereitzustellen. Eine neue Oberfläche allein ändert die fachliche Datumsregel nicht.</p>
</details>

Im [Explorer](../../explorer/) kannst du die beiden Pfeilansichten gegenüberstellen. Im [Vergleich](../vergleich/) untersuchen wir dieselben Änderungen auch für Layered, Hexagonal und Onion.
