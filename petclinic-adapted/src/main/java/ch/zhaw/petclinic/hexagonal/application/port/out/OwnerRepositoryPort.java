package ch.zhaw.petclinic.hexagonal.application.port.out;

import ch.zhaw.petclinic.domain.Owner;
import java.util.Optional;

public interface OwnerRepositoryPort {

	Optional<Owner> findById(int id);

	void save(Owner owner);

}
