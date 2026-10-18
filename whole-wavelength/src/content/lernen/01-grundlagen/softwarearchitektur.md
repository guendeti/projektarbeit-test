---
title: "Was ist Softwarearchitektur?"
slug: "softwarearchitektur"
lead: "Softwarearchitektur beschreibt die grundlegende Struktur und die wichtigen Entwurfsentscheidungen eines Softwaresystems: seine Bausteine, ihre Verantwortung und ihr Zusammenspiel."
diagram: "zoom"
takeaway: "Softwarearchitektur bedeutet, Verantwortlichkeiten, Abhängigkeiten und Grenzen bewusst zu gestalten – passend zu den Qualitätszielen und Randbedingungen des Systems."
sources: [architecture, layering, microservices]
question: "Welche Frage ist eine Architekturfrage?"
answers: ['Welche Farbe hat ein einzelner Button?', 'Welche Teile können unabhängig deployt werden?', 'Wie heisst eine lokale Variable?']
correct: 1
explanation: "Die Deployment-Grenze beeinflusst Struktur, Zusammenarbeit und Betrieb des Gesamtsystems."
---
## Warum ist Softwarearchitektur wichtig?

Stell dir eine Tierarztpraxis vor. Ihre Anwendung verwaltet Tierhalter, Haustiere, Tierärzte und Besuche. Am Anfang ist sie klein. Später könnten Rechnungsstellung oder Benachrichtigungen hinzukommen.

Ohne klare Verantwortlichkeiten kann es schwierig werden, eine Funktion zu ändern, ohne andere Funktionen unbeabsichtigt zu beeinflussen. Softwarearchitektur hilft, solche Abhängigkeiten bewusst zu gestalten.

Dabei geht es um mehr als Klassen und Ordner. Architekturentscheidungen beeinflussen beispielsweise, wie sich Teile eines Systems ändern, testen, betreiben und erweitern lassen.

## Drei Fragen als Ausgangspunkt

1. **Verantwortlichkeiten:** Welcher Baustein übernimmt welche Aufgabe?
2. **Abhängigkeiten:** Welche Bausteine kennen oder benötigen einander?
3. **Grenzen:** Welche Teile sollen unabhängig verändert oder betrieben werden können?

Ein Baustein kann je nach Perspektive beispielsweise ein fachliches Modul, eine ausführbare Anwendung oder eine Gruppe zusammengehöriger Klassen sein. Deshalb klären wir im nächsten Kapitel, auf welcher Ebene wir das System betrachten.

## Qualitätsziele und Randbedingungen

Eine Struktur ist nicht allein deshalb passend, weil sie einem bekannten Muster folgt. Zuerst müssen wir wissen, welche Eigenschaften für die Anwendung wichtig sind.

Soll ein Team Funktionen unabhängig veröffentlichen können? Müssen fachliche Regeln ohne Webserver getestet werden? Wie viel Betriebsaufwand kann das Team tragen? Auch vorhandene Technologien, Zeit und Teamgrösse begrenzen die Möglichkeiten.

Solche Ziele können miteinander in Konflikt stehen. Separate Services ermöglichen beispielsweise unabhängige Deployments, benötigen aber zusätzliche Mechanismen für Kommunikation und Betrieb. Ein Deployment ist das Bereitstellen einer ausführbaren Version der Anwendung.

## Architektur ist eine Abwägung

Es gibt keinen Ansatz, der für jede Anwendung optimal ist. Eine einfache Struktur kann schnell verständlich und leicht umzusetzen sein. Zusätzliche Abstraktionen können bestimmte Änderungen isolieren, erzeugen aber auch zusätzliche Schnittstellen und Implementierungsaufwand.

Die passende Entscheidung hängt unter anderem von fachlicher Komplexität, Änderungsanforderungen und den beteiligten Teams ab. Ein Muster ist ein Werkzeug, kein Qualitätsversprechen.

## Unser gemeinsames Beispiel

Wir verwenden durchgehend die Spring PetClinic. Auf der Systemebene betrachten wir unterschiedliche Aufteilungen derselben Tierarztpraxis. Auf der Codeebene untersuchen unsere eigenen Lehrbeispiele immer denselben Ablauf: **Einen Besuch für ein vorhandenes Haustier erfassen.**

So lassen sich Architekturentscheidungen vergleichen, ohne jedes Mal eine neue Fachdomäne lernen zu müssen. Die tatsächlichen Community-Varianten können zusätzliche Funktionen besitzen; diese Unterschiede kennzeichnen wir ausdrücklich.
