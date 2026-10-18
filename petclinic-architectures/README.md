# PetClinic Visit – vier Java-/Spring-Architekturvarianten

Eigenständiger, neu implementierter Lehrausschnitt der Spring-PetClinic-Domäne. Dies ist **kein vollständiger Fork** der Spring PetClinic und keine offizielle Spring-Variante. Referenz: `spring-projects/spring-petclinic@500158f732419217507c7656904b8e6aa1bcc0d6`.

## Start und Tests

Java 21 und Maven 3.9 oder neuer:

```sh
mvn verify
mvn spring-boot:run
```

Danach `http://127.0.0.1:8080` öffnen. Architektur und Haustier wählen, ein zukünftiges Datum und eine Beschreibung eingeben. Die H2-Dateidatenbank liegt unter `data/`; Besuche bleiben bei einem Neustart erhalten. Testläufe verwenden eine isolierte In-Memory-H2-Datenbank und eine feste Uhr (18.10.2026). Ein `mvn verify` startet weder die Website noch ein öffentlich erreichbares System.

## Vergleich

| Variante | Eingang | Use-Case | Persistenzvertrag | Äussere Implementierung |
| --- | --- | --- | --- | --- |
| Layered | VisitController | BookVisitService | konkrete äussere OwnerRepository-Klasse | OwnerRepository |
| Clean | VisitController → BookVisitUseCase | BookVisitInteractor | application.OwnerGateway | JdbcOwnerGateway |
| Hexagonal | VisitController → port.in.BookVisitUseCase | BookVisitService | port.out.OwnerRepositoryPort | JdbcOwnerAdapter |
| Onion | VisitController | BookVisitService | application.OwnerRepository | JdbcOwnerRepository |

Alle Varianten verwenden `domain.Owner`, `Visit`, `VisitCommand` und dieselben Regeln. Der Kern ist frei von Spring und JDBC. `configuration` verdrahtet die Objekte. Spring-Transaktionen werden an den äusseren HTTP-Einstiegspunkten geöffnet und umfassen Laden, Prüfung und Speichern. Wer den Use-Case ohne HTTP verwendet, muss für den JDBC-Adapter ebenfalls eine äussere Transaktionsgrenze bereitstellen. Clean verwendet hier einen synchronen void-Eingang und Exceptions; ein Presenter/Output-Boundary ist für diese reduzierte Demonstration nicht implementiert.

Die HTTP-Routen lauten `/api/{layered|clean|hexagonal|onion}/owners/{ownerId}/pets/{petId}/visits`. Ein POST enthält beispielsweise `{"date":"2099-12-01","description":"Kontrolle"}`. IDs aus dem Pfad sind massgebend. Antworten: 201 bei Erfolg, 400 bei ungültigen Angaben, 404 bei fehlendem Owner.

## Abweichungen und Grenzen

- REST/JSON und eine kleine HTML-Oberfläche ersetzen das originale Thymeleaf-Formular.
- Spring JDBC/H2 ersetzt Spring Data JPA. Die Schichtgrenze ist relevant; die Wahl von JPA ist keine Voraussetzung des Musters.
- Das pure Owner-Modell enthält nur die für diesen Use-Case notwendigen IDs und Visits. Die übrige PetClinic-Verwaltung ist nicht nachgebaut.
- Datum strikt nach heute, Beschreibung 1–255 Zeichen, vorhandener Owner und zugehöriges Pet. Trimmen der Beschreibung ist eine bewusste Lehrbeispiel-Regel. Kein Vet, keine Verfügbarkeits- oder Doppelbuchungsprüfung.
- Alle Varianten teilen die Datenbank für den Vergleich, keine vier unabhängigen Systeme. Die Module sind Codevarianten, keine Microservices.
- Die Speicherung ersetzt die Visit-Liste des Aggregats innerhalb einer Transaktion. Kein optimistisches Locking; konkurrierende Änderungen können verloren gehen. Keine Authentisierung, kein produktiver Betrieb vorgesehen.
- ArchUnit prüft konkrete Abhängigkeiten; daraus folgt keine universelle Zertifizierung der benannten Architekturmuster.

Das Browser-Lab der Microsite führt weiterhin TypeScript mit frischem In-Memory-Speicher aus. Java läuft separat. Die Java-Skizzen der Lernseiten erklären das Prinzip; der ausführbare Code hier verwendet JDBC und eine injizierte Clock.
