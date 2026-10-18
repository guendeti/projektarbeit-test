package org.springframework.samples.petclinic;

import java.net.URI;
import java.net.http.*;
import java.time.LocalDate;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ArchitectureIntegrationTest {

	@LocalServerPort
	int port;

	@Autowired
	JdbcTemplate jdbc;

	final HttpClient http = HttpClient.newHttpClient();

	@ParameterizedTest
	@ValueSource(strings = { "layered", "clean", "hexagonal", "onion" })
	void visitStoredThroughEachArchitectureAppearsOnOriginalOwnerPage(String architecture) throws Exception {
		int before = jdbc.queryForObject("select count(*) from visits where pet_id=1", Integer.class);
		String body = "{\"date\":\"" + LocalDate.now().plusDays(2) + "\",\"description\":\"Architecture test "
				+ architecture + "\"}";
		var response = http.send(HttpRequest
			.newBuilder(URI.create("http://localhost:" + port + "/api/" + architecture + "/owners/1/pets/1/visits"))
			.header("Content-Type", "application/json")
			.POST(HttpRequest.BodyPublishers.ofString(body))
			.build(), HttpResponse.BodyHandlers.ofString());
		assertThat(response.statusCode()).withFailMessage(response.body()).isEqualTo(201);
		assertThat(jdbc.queryForObject("select count(*) from visits where pet_id=1", Integer.class))
			.isEqualTo(before + 1);
		var owner = http.send(
				HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/owners/1")).GET().build(),
				HttpResponse.BodyHandlers.ofString());
		assertThat(owner.statusCode()).isEqualTo(200);
		assertThat(owner.body()).contains("Architecture test " + architecture)
			.contains("Visit architecture comparison");
	}

}
