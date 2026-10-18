package ch.zhaw.petclinic;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.*;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.time.*;
import static org.assertj.core.api.Assertions.*;
@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT, properties={
    "spring.datasource.url=jdbc:h2:mem:visit-tests;DB_CLOSE_DELAY=-1"})
class VisitHttpTest {
    @Autowired TestRestTemplate http;
    @Autowired JdbcTemplate jdbc;
    @TestConfiguration static class FixedClock {
        @Bean @Primary Clock fixed() { return Clock.fixed(Instant.parse("2026-10-18T12:00:00Z"), ZoneOffset.UTC); }
    }
    @BeforeEach void reset() { jdbc.update("delete from visits"); }
    ResponseEntity<String> post(String architecture, int owner, int pet, String date, String description) {
        String body = "{\"date\":\""+date+"\",\"description\":\""+description+"\"}";
        HttpHeaders headers = new HttpHeaders(); headers.setContentType(MediaType.APPLICATION_JSON);
        return http.postForEntity("/api/"+architecture+"/owners/"+owner+"/pets/"+pet+"/visits", new HttpEntity<>(body, headers), String.class);
    }
    @ParameterizedTest @ValueSource(strings={"layered","clean","hexagonal","onion"})
    void savesOnlySelectedPetAndKeepsPreviousVisits(String architecture) {
        assertThat(post(architecture,1,2,"2026-10-19","Kontrolle").getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(post(architecture,1,2,"2026-10-20","Nachkontrolle").getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(jdbc.queryForObject("select count(*) from visits where pet_id=2",Integer.class)).isEqualTo(2);
        assertThat(jdbc.queryForObject("select count(*) from visits where pet_id=1",Integer.class)).isZero();
    }
    @ParameterizedTest @ValueSource(strings={"layered","clean","hexagonal","onion"})
    void rejectsTodayPastAndImpossibleDateWithoutMutation(String architecture) {
        post(architecture,1,1,"2026-10-19","Erster Besuch");
        for(String date : new String[]{"2026-10-18","2026-10-17","2026-02-30","nonsense"})
            assertThat(post(architecture,1,1,date,"Kontrolle").getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(jdbc.queryForObject("select count(*) from visits",Integer.class)).isEqualTo(1);
    }
    @ParameterizedTest @ValueSource(strings={"layered","clean","hexagonal","onion"})
    void descriptionBoundaryAndWhitespace(String architecture) {
        assertThat(post(architecture,1,1,"2026-10-19","x".repeat(255)).getStatusCode()).isEqualTo(HttpStatus.CREATED);
        for(String description : new String[]{"", "   ","x".repeat(256)})
            assertThat(post(architecture,1,1,"2026-10-19",description).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(jdbc.queryForObject("select count(*) from visits",Integer.class)).isEqualTo(1);
    }
    @ParameterizedTest @ValueSource(strings={"layered","clean","hexagonal","onion"})
    void rejectsMissingOwnerAndWrongPet(String architecture) {
        assertThat(post(architecture,99,1,"2026-10-19","Kontrolle").getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(post(architecture,1,99,"2026-10-19","Kontrolle").getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(jdbc.queryForObject("select count(*) from visits",Integer.class)).isZero();
    }
    @ParameterizedTest @ValueSource(strings={"layered","clean","hexagonal","onion"})
    void rollsBackAStorageFailureIncludingThePriorDelete(String architecture) {
        assertThat(post(architecture,1,1,"2026-10-19","Bestehender Besuch").getStatusCode()).isEqualTo(HttpStatus.CREATED);
        jdbc.execute("alter table visits add constraint reject_failure check(description <> 'SIMULATED_DB_FAILURE')");
        try {
            assertThat(post(architecture,1,1,"2026-10-20","SIMULATED_DB_FAILURE").getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
            assertThat(jdbc.queryForObject("select count(*) from visits",Integer.class)).isEqualTo(1);
            assertThat(jdbc.queryForObject("select description from visits",String.class)).isEqualTo("Bestehender Besuch");
        } finally { jdbc.execute("alter table visits drop constraint reject_failure"); }
    }
}
