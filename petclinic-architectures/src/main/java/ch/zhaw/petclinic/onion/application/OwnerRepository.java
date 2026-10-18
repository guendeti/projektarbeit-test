package ch.zhaw.petclinic.onion.application;
import ch.zhaw.petclinic.domain.Owner;
import java.util.Optional;
public interface OwnerRepository {
    Optional<Owner> findById(int id);
    void save(Owner owner);
}
