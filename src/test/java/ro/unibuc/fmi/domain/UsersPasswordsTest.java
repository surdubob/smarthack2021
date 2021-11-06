package ro.unibuc.fmi.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import ro.unibuc.fmi.web.rest.TestUtil;

class UsersPasswordsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UsersPasswords.class);
        UsersPasswords usersPasswords1 = new UsersPasswords();
        usersPasswords1.setId(UUID.randomUUID());
        UsersPasswords usersPasswords2 = new UsersPasswords();
        usersPasswords2.setId(usersPasswords1.getId());
        assertThat(usersPasswords1).isEqualTo(usersPasswords2);
        usersPasswords2.setId(UUID.randomUUID());
        assertThat(usersPasswords1).isNotEqualTo(usersPasswords2);
        usersPasswords1.setId(null);
        assertThat(usersPasswords1).isNotEqualTo(usersPasswords2);
    }
}
