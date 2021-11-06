package ro.unibuc.fmi.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.unibuc.fmi.domain.UsersPasswords;

/**
 * Spring Data SQL repository for the UsersPasswords entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UsersPasswordsRepository extends JpaRepository<UsersPasswords, UUID> {
    @Query("select usersPasswords from UsersPasswords usersPasswords where usersPasswords.user.login = ?#{principal.username}")
    List<UsersPasswords> findByUserIsCurrentUser();

    @Query(
        "select count(usersPasswords.id) from UsersPasswords usersPasswords where usersPasswords.user.id=?#{#userId} and usersPasswords.id=?#{#passwordId}"
    )
    long passwordBelongsToUser(@Param("userId") long userId, @Param("passwordId") UUID passwordId);
}
