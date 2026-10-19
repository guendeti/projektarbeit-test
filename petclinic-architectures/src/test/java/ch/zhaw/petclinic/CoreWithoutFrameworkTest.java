package ch.zhaw.petclinic;

import ch.zhaw.petclinic.clean.application.OwnerGateway;
import ch.zhaw.petclinic.domain.Owner;
import ch.zhaw.petclinic.domain.VisitCommand;
import ch.zhaw.petclinic.hexagonal.application.port.out.OwnerRepositoryPort;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import static org.assertj.core.api.Assertions.*;

/** The same observable contract, driven without HTTP, Spring or a database. */
class CoreWithoutFrameworkTest {
    enum Variant { CLEAN, HEXAGONAL, ONION }

    private final Clock clock = Clock.fixed(
        Instant.parse("2026-10-19T12:00:00Z"), ZoneOffset.UTC);
    private final MemoryOwners owners = new MemoryOwners();

    @ParameterizedTest
    @EnumSource(Variant.class)
    void recordsTomorrowForSelectedPetWithoutFramework(Variant variant) {
        book(variant, new VisitCommand(1, 2,
            LocalDate.of(2026, 10, 20), "  Kontrolle  "));

        assertThat(owners.saved.pets().get(1)).isEmpty();
        assertThat(owners.saved.pets().get(2)).singleElement()
            .satisfies(visit -> {
                assertThat(visit.date()).isEqualTo(LocalDate.of(2026, 10, 20));
                assertThat(visit.description()).isEqualTo("Kontrolle");
            });
        assertThat(owners.saveCalls).isEqualTo(1);
    }

    @ParameterizedTest
    @EnumSource(Variant.class)
    void rejectsTodayWithoutSavingOrChangingStoredOwner(Variant variant) {
        VisitCommand invalid = new VisitCommand(1, 2,
            LocalDate.of(2026, 10, 19), "Kontrolle");

        assertThatThrownBy(() -> book(variant, invalid))
            .isInstanceOf(IllegalArgumentException.class);

        assertThat(owners.saveCalls).isZero();
        assertThat(owners.saved.pets().get(2)).isEmpty();
    }

    private void book(Variant variant, VisitCommand command) {
        switch (variant) {
            case CLEAN -> new ch.zhaw.petclinic.clean.application.BookVisitInteractor(
                owners, clock).bookVisit(command);
            case HEXAGONAL -> new ch.zhaw.petclinic.hexagonal.application.BookVisitService(
                owners, clock).bookVisit(command);
            case ONION -> new ch.zhaw.petclinic.onion.application.BookVisitService(
                owners, clock).bookVisit(command);
        }
    }

    static final class MemoryOwners implements OwnerGateway, OwnerRepositoryPort,
            ch.zhaw.petclinic.onion.application.OwnerRepository {
        private Owner saved = new Owner(1, Map.of(1, List.of(), 2, List.of()));
        private int saveCalls;

        public Optional<Owner> findById(int id) {
            return id == saved.id()
                ? Optional.of(new Owner(saved.id(), saved.pets())) : Optional.empty();
        }

        public void save(Owner owner) {
            saved = new Owner(owner.id(), owner.pets());
            saveCalls++;
        }
    }
}
