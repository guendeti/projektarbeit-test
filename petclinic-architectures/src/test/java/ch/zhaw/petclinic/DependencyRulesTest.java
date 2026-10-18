package ch.zhaw.petclinic;
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.*;
class DependencyRulesTest {
    final JavaClasses classes = new ClassFileImporter().withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
        .importPackages("ch.zhaw.petclinic");
    @Test void domainIsIndependent() {
        classes().that().resideInAPackage("..domain..").should().onlyDependOnClassesThat()
            .resideInAnyPackage("java..","..domain..").check(classes);
    }
    @Test void innerApplicationsDoNotKnowTechnicalAdapters() {
        noClasses().that().resideInAnyPackage("..clean.application..","..hexagonal.application..","..onion.application..")
            .should().dependOnClassesThat().resideInAnyPackage("org.springframework..","..infrastructure..","..adapter..","..web..","..configuration..")
            .check(classes);
    }
    @Test void variantsRemainSeparate() {
        for(String variant : new String[]{"layered","clean","hexagonal","onion"})
            for(String other : new String[]{"layered","clean","hexagonal","onion"})
                if(!variant.equals(other)) noClasses().that().resideInAPackage(".."+variant+"..")
                    .should().dependOnClassesThat().resideInAPackage(".."+other+"..").check(classes);
    }
    @Test void webUsesAnInnerInputContractInCleanAndHexagonal() {
        noClasses().that().resideInAnyPackage("..clean.web..","..hexagonal.web..")
            .should().dependOnClassesThat().haveSimpleName("BookVisitInteractor").check(classes);
        noClasses().that().resideInAPackage("..hexagonal.web..")
            .should().dependOnClassesThat().haveSimpleName("BookVisitService").check(classes);
    }
}
