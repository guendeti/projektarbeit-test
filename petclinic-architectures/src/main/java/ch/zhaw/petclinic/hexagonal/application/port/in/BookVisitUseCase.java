package ch.zhaw.petclinic.hexagonal.application.port.in;
import ch.zhaw.petclinic.domain.VisitCommand;
public interface BookVisitUseCase { void bookVisit(VisitCommand command); }
