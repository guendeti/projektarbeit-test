package ch.zhaw.petclinic.configuration;

import ch.zhaw.petclinic.infrastructure.OwnerJdbcStorage;
import org.springframework.context.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.time.Clock;

@Configuration
public class VisitConfiguration {

	@Bean
	Clock clock() {
		return Clock.systemDefaultZone();
	}

	@Bean
	OwnerJdbcStorage storage(JdbcTemplate jdbc) {
		return new OwnerJdbcStorage(jdbc);
	}

	@Bean
	ch.zhaw.petclinic.layered.data.OwnerRepository layeredAdapter(OwnerJdbcStorage storage) {
		return new ch.zhaw.petclinic.layered.data.OwnerRepository(storage);
	}

	@Bean
	ch.zhaw.petclinic.layered.application.BookVisitService layeredService(
			ch.zhaw.petclinic.layered.data.OwnerRepository adapter, Clock clock) {
		return new ch.zhaw.petclinic.layered.application.BookVisitService(adapter, clock);
	}

	@Bean
	ch.zhaw.petclinic.clean.adapter.JdbcOwnerGateway cleanAdapter(OwnerJdbcStorage storage) {
		return new ch.zhaw.petclinic.clean.adapter.JdbcOwnerGateway(storage);
	}

	@Bean
	ch.zhaw.petclinic.clean.application.BookVisitInteractor cleanService(
			ch.zhaw.petclinic.clean.adapter.JdbcOwnerGateway adapter, Clock clock) {
		return new ch.zhaw.petclinic.clean.application.BookVisitInteractor(adapter, clock);
	}

	@Bean
	ch.zhaw.petclinic.hexagonal.adapter.JdbcOwnerAdapter hexagonalAdapter(OwnerJdbcStorage storage) {
		return new ch.zhaw.petclinic.hexagonal.adapter.JdbcOwnerAdapter(storage);
	}

	@Bean
	ch.zhaw.petclinic.hexagonal.application.BookVisitService hexagonalService(
			ch.zhaw.petclinic.hexagonal.adapter.JdbcOwnerAdapter adapter, Clock clock) {
		return new ch.zhaw.petclinic.hexagonal.application.BookVisitService(adapter, clock);
	}

	@Bean
	ch.zhaw.petclinic.onion.infrastructure.JdbcOwnerRepository onionAdapter(OwnerJdbcStorage storage) {
		return new ch.zhaw.petclinic.onion.infrastructure.JdbcOwnerRepository(storage);
	}

	@Bean
	ch.zhaw.petclinic.onion.application.BookVisitService onionService(
			ch.zhaw.petclinic.onion.infrastructure.JdbcOwnerRepository adapter, Clock clock) {
		return new ch.zhaw.petclinic.onion.application.BookVisitService(adapter, clock);
	}

}
