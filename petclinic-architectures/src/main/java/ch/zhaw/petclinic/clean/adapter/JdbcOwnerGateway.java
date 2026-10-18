package ch.zhaw.petclinic.clean.adapter;
import ch.zhaw.petclinic.domain.Owner;
import ch.zhaw.petclinic.infrastructure.OwnerJdbcStorage;
import java.util.Optional;
import ch.zhaw.petclinic.clean.application.OwnerGateway;
public final class JdbcOwnerGateway implements OwnerGateway {
    private final OwnerJdbcStorage storage;
    public JdbcOwnerGateway(OwnerJdbcStorage storage) { this.storage = storage; }
    public Optional<Owner> findById(int id) { return storage.findById(id); }
    public void save(Owner owner) { storage.save(owner); }
}
