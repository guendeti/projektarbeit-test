package ch.zhaw.petclinic.infrastructure;
import ch.zhaw.petclinic.domain.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.*;
public final class OwnerJdbcStorage {
    private final JdbcTemplate jdbc;
    public OwnerJdbcStorage(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    public Optional<Owner> findById(int id) {
        if (jdbc.queryForObject("select count(*) from owners where id=?", Integer.class, id) == 0)
            return Optional.empty();
        Map<Integer, List<Visit>> pets = new LinkedHashMap<>();
        jdbc.queryForList("select id from pets where owner_id=? order by id", Integer.class, id)
            .forEach(pet -> pets.put(pet, jdbc.query("select visit_date, description from visits where pet_id=? order by id",
                (row, n) -> new Visit(row.getDate(1).toLocalDate(), row.getString(2)), pet)));
        return Optional.of(new Owner(id, pets));
    }
    // A small aggregate replacement strategy; caller opens the database transaction.
    public void save(Owner owner) {
        owner.pets().forEach((pet, visits) -> {
            jdbc.update("delete from visits where pet_id=?", pet);
            visits.forEach(visit -> jdbc.update("insert into visits(pet_id, visit_date, description) values(?,?,?)",
                pet, visit.date(), visit.description()));
        });
    }
}
