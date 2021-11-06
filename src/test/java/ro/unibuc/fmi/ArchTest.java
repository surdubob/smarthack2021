package ro.unibuc.fmi;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("ro.unibuc.fmi");

        noClasses()
            .that()
            .resideInAnyPackage("ro.unibuc.fmi.service..")
            .or()
            .resideInAnyPackage("ro.unibuc.fmi.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..ro.unibuc.fmi.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
