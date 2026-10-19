package ch.zhaw.petclinic.domain;
import java.time.Clock;
import java.time.LocalDate;
import java.util.*;
public final class Owner {
    private final int id;
    private final Map<Integer, List<Visit>> pets;
    public Owner(int id, Map<Integer, List<Visit>> pets) {
        this.id = id;
        this.pets = new LinkedHashMap<>();
        pets.forEach((pet, visits) -> this.pets.put(pet, new ArrayList<>(visits)));
    }
    public int id() { return id; }
    public Map<Integer, List<Visit>> pets() {
        Map<Integer, List<Visit>> result = new LinkedHashMap<>();
        pets.forEach((pet, visits) -> result.put(pet, List.copyOf(visits)));
        return Collections.unmodifiableMap(result);
    }
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
}
