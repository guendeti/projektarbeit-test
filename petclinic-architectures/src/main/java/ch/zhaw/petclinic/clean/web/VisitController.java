package ch.zhaw.petclinic.clean.web;
import ch.zhaw.petclinic.domain.VisitCommand;
import ch.zhaw.petclinic.clean.application.BookVisitUseCase;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
@RestController("cleanVisitController")
@RequestMapping("/api/clean/owners/{ownerId}/pets/{petId}/visits")
public class VisitController {
    private final BookVisitUseCase useCase;
    public VisitController(BookVisitUseCase useCase) { this.useCase = useCase; }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) @Transactional
    public void create(@PathVariable int ownerId, @PathVariable int petId, @RequestBody VisitInput input) {
        useCase.bookVisit(new VisitCommand(ownerId, petId, input.date(), input.description()));
    }
    public record VisitInput(java.time.LocalDate date, String description) {}
}
