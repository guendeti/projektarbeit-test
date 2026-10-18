package ch.zhaw.petclinic.clean.application;
import ch.zhaw.petclinic.domain.*;
import java.time.Clock;
import java.util.NoSuchElementException;
import ch.zhaw.petclinic.clean.application.OwnerGateway;
import ch.zhaw.petclinic.clean.application.BookVisitUseCase;
public final class BookVisitInteractor implements BookVisitUseCase {
    private final OwnerGateway owners;
    private final Clock clock;
    public BookVisitInteractor(OwnerGateway owners, Clock clock) { this.owners = owners; this.clock = clock; }
    public void bookVisit(VisitCommand command) {
        Owner owner = owners.findById(command.ownerId()).orElseThrow(() -> new NoSuchElementException("Owner nicht gefunden."));
        owner.addVisit(command, clock);
        owners.save(owner);
    }
}
