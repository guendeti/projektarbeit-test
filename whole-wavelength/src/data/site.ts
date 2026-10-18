export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path = '') => `${base}/${path.replace(/^\//, '')}`;
export const repository = 'https://github.com/guendeti/projektarbeit-test';
export const chapters = [
  { number: '01', title: 'Grundlagen', description: 'Begriffe klären. Die richtige Perspektive finden.', items: [
    { slug: 'softwarearchitektur', title: 'Was ist Softwarearchitektur?', minutes: 5 },
    { slug: 'system-und-codeebene', title: 'System- und Codeebene', minutes: 4 },
  ] },
  { number: '02', title: 'Spring PetClinic', description: 'Eine Tierarztpraxis als gemeinsames Beispiel.', items: [
    { slug: 'spring-petclinic', title: 'Die PetClinic kennenlernen', minutes: 5 },
  ] },
  { number: '03', title: 'Systemebene', description: 'Anwendungen zerlegen und Grenzen verstehen.', items: [
    { slug: 'monolith', title: 'Monolith', minutes: 6 },
    { slug: 'modular-monolith', title: 'Modular Monolith', minutes: 7 },
    { slug: 'microservices', title: 'Microservices', minutes: 7 },
    { slug: 'scs-isa', title: 'Self-contained Systems & ISA', minutes: 9 },
  ] },
  { number: '04', title: 'Codeebene', description: 'Ein Use-Case. Vier Sichtweisen auf den Code.', items: [
    { slug: 'visit-use-case', title: 'Der Visit-Use-Case', minutes: 5 },
    { slug: 'layered-architecture', title: 'Layered Architecture', minutes: 7 },
    { slug: 'clean-architecture', title: 'Clean Architecture', minutes: 8 },
    { slug: 'hexagonal-architecture', title: 'Hexagonal Architecture', minutes: 8 },
    { slug: 'onion-architecture', title: 'Onion Architecture', minutes: 7 },
    { slug: 'vergleich', title: 'Architekturen vergleichen', minutes: 8 },
  ] },
];
export const lessons = chapters.flatMap(chapter => chapter.items.map(item => ({ ...item, chapter: chapter.title, number: chapter.number })));
export const sources = [
  { id: 'petclinic', title: 'Spring PetClinic', author: 'Spring Projects', href: 'https://github.com/spring-projects/spring-petclinic', note: 'Kanonische Spring-Boot-/Thymeleaf-Anwendung und Ausgangspunkt des Beispiels.' },
  { id: 'visit', title: 'VisitController.java', author: 'Spring Projects', href: 'https://github.com/spring-projects/spring-petclinic/blob/main/src/main/java/org/springframework/samples/petclinic/owner/VisitController.java', note: 'Referenz für Laden, Validierung und Speichern des Visits. Der main-Branch entwickelt sich weiter.' },
  { id: 'layering', title: 'Presentation Domain Data Layering', author: 'Martin Fowler', href: 'https://martinfowler.com/bliki/PresentationDomainDataLayering.html', note: 'Logische Schichten, ihre Verantwortung und ihre Abhängigkeiten.' },
  { id: 'framework', title: 'Spring Framework PetClinic', author: 'Spring PetClinic Community', href: 'https://github.com/spring-petclinic/spring-framework-petclinic', note: 'PetClinic-Variante mit expliziter Service-Schicht.' },
  { id: 'modulith', title: 'Application Modules', author: 'Spring Modulith', href: 'https://docs.spring.io/spring-modulith/reference/fundamentals.html', note: 'Modul-API, interne Implementierung und strukturelle Prüfung.' },
  { id: 'petclinic-modulith', title: 'Spring PetClinic Modulith', author: 'Spring PetClinic Community', href: 'https://github.com/spring-petclinic/spring-petclinic-modulith', note: 'Modulare Variante mit fachlichen Modulen und Application Events.' },
  { id: 'microservices', title: 'Microservices', author: 'James Lewis & Martin Fowler · 2014', href: 'https://martinfowler.com/articles/microservices.html', note: 'Unabhängig deploybare Services und die Kosten verteilter Systeme.' },
  { id: 'petclinic-microservices', title: 'Spring PetClinic Microservices', author: 'Spring PetClinic Community', href: 'https://github.com/spring-petclinic/spring-petclinic-microservices', note: 'Customers, Visits, Vets und die technische Infrastruktur mit Spring Cloud.' },
  { id: 'scs', title: 'Self-contained Systems', author: 'SCS Architecture', href: 'https://scs-architecture.org/', note: 'Autonome fachliche Webanwendungen mit eigener UI, Logik und Daten.' },
  { id: 'isa', title: 'Independent Systems Architecture', author: 'ISA Principles', href: 'https://isa-principles.org/', note: 'Neun Prinzipien für unabhängige Systeme und gemeinsame Integrationsregeln.' },
  { id: 'clean', title: 'The Clean Architecture', author: 'Robert C. Martin · 2012', href: 'https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html', note: 'Dependency Rule, Entities, Use Cases, Adapter und Frameworks.' },
  { id: 'hexagonal', title: 'Hexagonal Architecture', author: 'Alistair Cockburn · 2005', href: 'https://alistair.cockburn.us/hexagonal-architecture', note: 'Originalbeschreibung von Ports and Adapters und der Grenze zwischen innen und aussen.' },
  { id: 'onion', title: 'The Onion Architecture · Part 1', author: 'Jeffrey Palermo · 2008', href: 'https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/', note: 'Domain Model im Zentrum und Infrastruktur am äusseren Rand.' },
];
