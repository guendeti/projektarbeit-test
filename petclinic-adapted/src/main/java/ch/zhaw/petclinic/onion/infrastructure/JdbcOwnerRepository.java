package ch.zhaw.petclinic.onion.infrastructure;

import ch.zhaw.petclinic.domain.Owner;
import ch.zhaw.petclinic.infrastructure.OwnerJdbcStorage;
import java.util.Optional;
import ch.zhaw.petclinic.onion.application.OwnerRepository;

public final class JdbcOwnerRepository implements OwnerRepository {

	private final OwnerJdbcStorage storage;

	public JdbcOwnerRepository(OwnerJdbcStorage storage) {
		this.storage = storage;
	}

	public Optional<Owner> findById(int id) {
		return storage.findById(id);
	}

	public void save(Owner owner) {
		storage.save(owner);
	}

}
