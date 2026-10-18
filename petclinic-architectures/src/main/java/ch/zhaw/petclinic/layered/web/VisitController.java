package ch.zhaw.petclinic.layered.web;
import ch.zhaw.petclinic.domain.VisitCommand;
import ch.zhaw.petclinic.layered.application.BookVisitService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
@RestController("layeredVisitController")
@RequestMapping("/api/layered/owners/{ownerId}/pets/{petId}/visits")
public class VisitController {
    private final BookVisitService useCase;
    public VisitController(BookVisitService useCase) { this.useCase = useCase; }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) @Transactional
    public void create(@PathVariable int ownerId, @PathVariable int petId, @RequestBody VisitInput input) {
        useCase.bookVisit(new VisitCommand(ownerId, petId, input.date(), input.description()));
    }
    public record VisitInput(java.time.LocalDate date, String description) {}
}
