package ch.zhaw.petclinic.configuration;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
@RestControllerAdvice(basePackages = "ch.zhaw.petclinic")
public class ApiErrors {
    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Map<String,String>> invalid(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
    @ExceptionHandler(NoSuchElementException.class)
    ResponseEntity<Map<String,String>> missing(NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
    }
    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<Map<String,String>> malformed() {
        return ResponseEntity.badRequest().body(Map.of("error", "UngÃ¼ltige JSON-Daten oder ungÃ¼ltiges Datum."));
    }
}
