package ch.zhaw.petclinic.onion.application;

import ch.zhaw.petclinic.domain.*;
import java.time.Clock;
import java.util.NoSuchElementException;
import ch.zhaw.petclinic.onion.application.OwnerRepository;

public final class BookVisitService {

	private final OwnerRepository owners;

	private final Clock clock;

	public BookVisitService(OwnerRepository owners, Clock clock) {
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
