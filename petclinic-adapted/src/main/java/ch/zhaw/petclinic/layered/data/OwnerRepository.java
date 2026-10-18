package ch.zhaw.petclinic.layered.data;

import ch.zhaw.petclinic.domain.Owner;
import ch.zhaw.petclinic.infrastructure.OwnerJdbcStorage;
import java.util.Optional;

public final class OwnerRepository {

	private final OwnerJdbcStorage storage;

	public OwnerRepository(OwnerJdbcStorage storage) {
		this.storage = storage;
	}

	public Optional<Owner> findById(int id) {
		return storage.findById(id);
	}

	public void save(Owner owner) {
		storage.save(owner);
	}

}
