package ch.zhaw.petclinic.hexagonal.application;

import ch.zhaw.petclinic.domain.*;
import java.time.Clock;
import java.util.NoSuchElementException;
import ch.zhaw.petclinic.hexagonal.application.port.out.OwnerRepositoryPort;
import ch.zhaw.petclinic.hexagonal.application.port.in.BookVisitUseCase;

public final class BookVisitService implements BookVisitUseCase {

	private final OwnerRepositoryPort owners;

	private final Clock clock;

	public BookVisitService(OwnerRepositoryPort owners, Clock clock) {
		this.owners = owners;
		this.clock = clock;
	}

	public void bookVisit(VisitCommand command) {
		Owner owner = owners.findById(command.ownerId())
			.orElseThrow(() -> new NoSuchElementException("Owner nicht gefunden."));
		owner.addVisit(command, clock);
		owners.save(owner);
	}

}
