# Angepasste Spring PetClinic

Basis: spring-projects/spring-petclinic, Commit `500158f732419217507c7656904b8e6aa1bcc0d6`.
Die ursprüngliche Apache-2.0-Lizenz und alle Herkunftshinweise bleiben erhalten.

## Änderungen

- Hinzugefügt: `ch.zhaw.petclinic` mit vier Visit-Varianten, gemeinsamem frameworkfreiem Fachmodell, JDBC-Speicher und Spring-Konfiguration (aus dem eigenen Lehrausschnitt).
- `PetClinicApplication` erweitert die Komponentensuche auf das neue Package. Die ursprünglichen MVC-Test-Slices bleiben dadurch isoliert; Fehlerbehandlung ist auf die hinzugefügten API-Packages begrenzt.
- Owner-Detailseiten verlinken je Pet auf `architecture-visit.html` mit korrektem Owner-/Pet-Kontext.
- Das neue Formular wählt Layered, Clean, Hexagonal oder Onion. Es nutzt dieselben vorhandenen Owner-/Pet-/Visit-Tabellen. Neue Besuche sind auf der originalen Detailseite sichtbar.
- `ArchitectureIntegrationTest` prüft alle vier Wege bis zur originalen gerenderten Detailseite.
- Der ursprüngliche Thymeleaf-Visit-Controller bleibt als Baseline erhalten. Die übrigen Features werden nicht nach einem der vier Muster umgebaut. Die **gesamte** PetClinic wird daher nicht als Clean/Hexagonal/Onion-konform bezeichnet.

## Start und Prüfung

Java 21 und Maven 3.9+ verwenden. `mvn test` führt den Standard-Testumfang mit dem zusätzlichen Integrationstest aus. `mvn spring-boot:run` startet die PetClinic. Owner suchen → Pet auswählen → **Visit architecture comparison**. Die originale Anwendung verwendet standardmässig ihre In-Memory-Datenbank; diese Anpassung ändert deren Lebensdauer nicht.

Die vier neuen API-Wege haben dieselben Beschränkungen wie der separate Lehrausschnitt: keine Authentisierung, keine Vet-Zuweisung, kein optimistisches Locking und vereinfachtes Ersetzen der Visit-Liste innerhalb einer Transaktion. Sie dienen dem lokalen Architekturvergleich. Bibliotheksversionen und Buildkonfiguration der gepinnten Basis werden beibehalten. Detaillierte Regeln und Grenzen: `../petclinic-architectures/README.md`.
