package ch.zhaw.petclinic.domain;
import java.time.LocalDate;
public record VisitCommand(int ownerId, int petId, LocalDate date, String description) {}
