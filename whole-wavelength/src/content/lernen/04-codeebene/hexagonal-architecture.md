---
title: "Hexagonal Architecture"
slug: "hexagonal-architecture"
lead: "Die Anwendung liegt innen, Technik liegt aussen. Ports beschreiben angebotene und benötigte Interaktionen; Adapter verbinden diese Verträge mit Web, Datenbank oder Tests."
diagram: "hexagonal"
takeaway: "Ein Port definiert eine Interaktion aus Sicht der Anwendung. Ein Adapter verbindet diese Interaktion mit einer konkreten Technologie."
sources: [hexagonal, clean]
question: "Ein neuer Kommandozeilenzugang soll denselben Visit erfassen. Welche Lösung erhält die hexagonale Grenze?"
answers: ['Der neue Zugang kopiert die Fachregeln aus Owner.', 'Der Input Port erhält zusätzliche HTTP- und Konsolentypen.', 'Ein weiterer Driving Adapter übersetzt seine Eingabe und verwendet den vorhandenen Input Port.']
correct: 2
explanation: "Der neue Adapter kennt seine Zugangstechnik. Der fachliche Eingangsvertrag und der Kern bleiben unabhängig davon."
---
## Lernziel und Perspektive

Nach diesem Kapitel kannst du Driving und Driven Adapter unterscheiden, die Verantwortung eines Ports begründen und denselben Visit ohne Webserver ausführen.

Alistair Cockburn beschreibt eine Anwendung, die durch Menschen, andere Programme oder automatisierte Tests angesteuert werden kann und von ihren technischen Ein- und Ausgabegeräten getrennt bleibt. Das Hexagon veranschaulicht innen und aussen; sechs Ports sind keine Vorgabe. Ein Port steht für eine zweckmässige Interaktion, an die unterschiedliche Adapter anschliessen können. [Cockburns Originalbeschreibung](../../quellen/#hexagonal)

Unsere ausführbare Java-Variante besitzt einen Eingang zum Erfassen des Visits und einen Ausgang für Owner-Persistenz. Die Benennung `port/in` und `port/out` ist eine Projektkonvention. Das Muster selbst verlangt diese Verzeichnisse nicht. Die Java-Ausschnitte entsprechen den tatsächlichen Dateien; die Browser-Demo bildet denselben Mechanismus in TypeScript ab.

## Die Driving Side bietet den Use Case an

Ein Driving Adapter löst eine Fähigkeit der Anwendung aus. Der REST-Controller übersetzt Route und JSON in `VisitCommand`. Er ruft folgenden inneren Vertrag auf:

```java source=petclinic-architectures/src/main/java/ch/zhaw/petclinic/hexagonal/application/port/in/BookVisitUseCase.java
public interface BookVisitUseCase {
    void bookVisit(VisitCommand command);
}
```

`BookVisitService` implementiert den Input Port. Die Methode enthält keine HTTP-Typen und benötigt keinen Spring-Server. Der Port beschreibt das fachliche Angebot „Visit erfassen“, nicht die URL oder das Transportformat. Das Interface selbst führt nichts aus; der Aufruf erreicht die Serviceinstanz über diesen Vertrag.

Ein zweiter Zugang muss deshalb keine Kopie der Datumsprüfung erhalten. Er übersetzt nur seine Eingabe und ruft denselben Service an. Fachliche Validierung bleibt in `Owner.addVisit`, unabhängig davon, ob die Eingabe aus einem Formular oder einem Test stammt.

## Die Driven Side erfüllt einen Bedarf des Kerns

Beim Ausführen benötigt der Service einen Owner und muss dessen Änderung speichern. Diesen Bedarf formuliert der Output Port:

```java source=petclinic-architectures/src/main/java/ch/zhaw/petclinic/hexagonal/application/port/out/OwnerRepositoryPort.java
public interface OwnerRepositoryPort {
    Optional<Owner> findById(int id);
    void save(Owner owner);
}
```

Der `JdbcOwnerAdapter` liegt ausserhalb des Kerns. Er implementiert diesen Vertrag und delegiert an den gemeinsamen JDBC-Speicher. Ein Testersatz kann denselben Port erfüllen. Der Kern kennt beide technischen Ausprägungen nicht.

```text
Driving: REST-Controller → Service über BookVisitUseCase
Driven:  Service → eingesetzter JDBC-Adapter über OwnerRepositoryPort
Code:    Service → OwnerRepositoryPort ← JdbcOwnerAdapter
```

„Input“ und „Output“ bezeichnen hier die Initiative der Interaktion. Auch ein Output Port liefert Werte zurück; die Richtung der Daten allein entscheidet seine Einordnung nicht. Laden und Speichern sind beide vom Kern ausgelöste Interaktionen.

## Einen echten zweiten Zugang untersuchen

`CoreWithoutFrameworkTest` steuert dieselben inneren Anwendungsfälle direkt an. Seine `book`-Methode wählt für Hexagonal den `BookVisitService`; `MemoryOwners` erfüllt dessen Persistenzport. Der Test benötigt weder HTTP noch Spring-Kontext noch Datenbank. Ein Ausschnitt des Erfolgsfalls lautet:

```java source=petclinic-architectures/src/test/java/ch/zhaw/petclinic/CoreWithoutFrameworkTest.java
book(variant, new VisitCommand(1, 2,
    LocalDate.of(2026, 10, 20), "  Kontrolle  "));

assertThat(owners.saved.pets().get(1)).isEmpty();
assertThat(owners.saved.pets().get(2)).singleElement()
    .satisfies(visit -> {
        assertThat(visit.date()).isEqualTo(LocalDate.of(2026, 10, 20));
        assertThat(visit.description()).isEqualTo("Kontrolle");
    });
assertThat(owners.saveCalls).isEqualTo(1);
```

Der Test ist ein weiterer treibender Zugang. Er kontrolliert, dass nur das ausgewählte Pet verändert und die Beschreibung getrimmt wird. Die feste Uhr macht den Folgetag eindeutig. Derselbe Test wird auch für Clean und Onion ausgeführt: Testbarkeit ist eine gemeinsame Möglichkeit dieser Grenzen und kein exklusives Merkmal des Hexagons. [Vollständigen Test lesen](../../code/#java-core-test)

## Wie gross soll ein Port sein

Unser Persistenzport umfasst zwei zusammengehörige Operationen aus Sicht des Use-Cases. Er heisst nicht `executeSql` und verlangt keine JDBC-Verbindung. Ein technisch geprägter Vertrag würde Implementierungsdetails zurück in den Kern tragen, selbst wenn er in einem Verzeichnis namens `port` liegt.

Nicht jede Methode braucht ein eigenes Interface. Ein überfeiner Schnitt erhöht die Anzahl der Verträge, ohne notwendigerweise eine weitere unabhängige Interaktion abzubilden. Umgekehrt wäre ein universelles Interface für sämtliche technischen Aufgaben der Praxis zu unspezifisch. Der Zuschnitt muss den Bedarf des Anwendungsfalls erklären können.

## Änderungen und Grenzen des Beispiels

Ein zusätzlicher Driving Adapter verwendet den bestehenden Eingang. Ein anderer Speicher erfüllt den bestehenden Ausgang, sofern dessen Semantik passt. Die Spring-Konfiguration setzt die konkreten Objekte zusammen. Für echte Schreibvorgänge bleibt eine äussere Transaktionsgrenze erforderlich; der In-Memory-Test prüft kein Datenbank-Rollback.

Die Struktur ähnelt Clean bewusst. Clean betont die unterschiedlichen Regeln und Mechanismen, Hexagonal die Interaktionen an der Grenze. Unser kleiner Visit erlaubt beide Beschreibungen. Mehr Ports oder anders benannte Packages wären kein Beweis für eine bessere Architektur.

## Transferaufgabe

Ein Entwickler erweitert `OwnerRepositoryPort.findById` um einen Parameter vom Typ `HttpServletRequest`, damit der Adapter den angemeldeten Benutzer prüfen kann. Ist der Port noch passend geschnitten? Formuliere eine Alternative.

<details>
<summary>Lösung und Begründung anzeigen</summary>
<p>Der Port würde den Anwendungskern an eine Webtechnik binden. Der Webadapter sollte erforderlichen fachlichen Benutzerkontext in eine technikunabhängige Darstellung übersetzen. Wo eine Berechtigungsentscheidung liegt und ob dafür ein eigener Port benötigt wird, hängt von der Fachanforderung ab. Authentisierung ist in unserem kleinen Lehrbeispiel nicht implementiert und wird durch diese Aufgabe nicht als vorhanden behauptet.</p>
</details>
