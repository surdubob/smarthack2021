package ro.unibuc.fmi.domain;

import java.io.Serializable;
import java.util.UUID;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A UsersPasswords.
 */
@Entity
@Table(name = "users_passwords")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UsersPasswords implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Type(type = "uuid-char")
    @Column(name = "id", length = 36)
    private UUID id;

    @Column(name = "secret")
    private String secret;

    @Column(name = "type")
    private String type;

    @Column(name = "platform")
    private String platform;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public UsersPasswords id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSecret() {
        return this.secret;
    }

    public UsersPasswords secret(String secret) {
        this.setSecret(secret);
        return this;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getType() {
        return this.type;
    }

    public UsersPasswords type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPlatform() {
        return this.platform;
    }

    public UsersPasswords platform(String platform) {
        this.setPlatform(platform);
        return this;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UsersPasswords user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UsersPasswords)) {
            return false;
        }
        return id != null && id.equals(((UsersPasswords) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UsersPasswords{" +
            "id=" + getId() +
            ", secret='" + getSecret() + "'" +
            ", type='" + getType() + "'" +
            ", platform='" + getPlatform() + "'" +
            "}";
    }
}
