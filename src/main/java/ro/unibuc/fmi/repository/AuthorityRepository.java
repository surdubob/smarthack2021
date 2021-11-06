package ro.unibuc.fmi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.unibuc.fmi.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
