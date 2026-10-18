package ch.zhaw.petclinic.domain;
import java.time.LocalDate;
public record Visit(LocalDate date, String description) {}
