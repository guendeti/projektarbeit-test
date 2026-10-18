package ch.zhaw.petclinic.clean.application;

import ch.zhaw.petclinic.domain.Owner;
import java.util.Optional;

public interface OwnerGateway {

	Optional<Owner> findById(int id);

	void save(Owner owner);

}
