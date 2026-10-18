package ch.zhaw.petclinic.hexagonal.adapter;

import ch.zhaw.petclinic.domain.Owner;
import ch.zhaw.petclinic.infrastructure.OwnerJdbcStorage;
import java.util.Optional;
import ch.zhaw.petclinic.hexagonal.application.port.out.OwnerRepositoryPort;

public final class JdbcOwnerAdapter implements OwnerRepositoryPort {

	private final OwnerJdbcStorage storage;

	public JdbcOwnerAdapter(OwnerJdbcStorage storage) {
		this.storage = storage;
	}

	public Optional<Owner> findById(int id) {
		return storage.findById(id);
	}

	public void save(Owner owner) {
		storage.save(owner);
	}

}
