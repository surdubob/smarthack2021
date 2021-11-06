package ro.unibuc.fmi.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ro.unibuc.fmi.domain.User;
import ro.unibuc.fmi.domain.UsersPasswords;
import ro.unibuc.fmi.encryptors.EncryptionTool;
import ro.unibuc.fmi.encryptors.SmarthackKeyGenerator;
import ro.unibuc.fmi.repository.UsersPasswordsRepository;
import ro.unibuc.fmi.service.UserService;
import ro.unibuc.fmi.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ro.unibuc.fmi.domain.UsersPasswords}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UsersPasswordsResource {

    private final Logger log = LoggerFactory.getLogger(UsersPasswordsResource.class);

    private static final String ENTITY_NAME = "usersPasswords";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserService userService;

    private final UsersPasswordsRepository usersPasswordsRepository;

    public UsersPasswordsResource(UsersPasswordsRepository usersPasswordsRepository, UserService userService) {
        this.usersPasswordsRepository = usersPasswordsRepository;
        this.userService = userService;
    }

    /**
     * {@code POST  /users-passwords} : Create a new usersPasswords.
     *
     * @param usersPasswords the usersPasswords to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new usersPasswords, or with status {@code 400 (Bad Request)} if the usersPasswords has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/users-passwords")
    public ResponseEntity<UsersPasswords> createUsersPasswords(@RequestBody UsersPasswords usersPasswords) throws URISyntaxException {
        log.debug("REST request to save UsersPasswords : {}", usersPasswords);
        if (usersPasswords.getId() != null) {
            throw new BadRequestAlertException("A new usersPasswords cannot already have an ID", ENTITY_NAME, "idexists");
        }
        try {
            EncryptionTool enc = new EncryptionTool();
            usersPasswords.secret(enc.encrypt(usersPasswords.getSecret()));
            UsersPasswords result = usersPasswordsRepository.save(usersPasswords);
            return ResponseEntity
                .created(new URI("/api/users-passwords/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.I_AM_A_TEAPOT).build();
    }

    /**
     * {@code PUT  /users-passwords/:id} : Updates an existing usersPasswords.
     *
     * @param id the id of the usersPasswords to save.
     * @param usersPasswords the usersPasswords to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usersPasswords,
     * or with status {@code 400 (Bad Request)} if the usersPasswords is not valid,
     * or with status {@code 500 (Internal Server Error)} if the usersPasswords couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/users-passwords/{id}")
    public ResponseEntity<UsersPasswords> updateUsersPasswords(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody UsersPasswords usersPasswords
    ) throws URISyntaxException {
        log.debug("REST request to update UsersPasswords : {}, {}", id, usersPasswords);
        if (usersPasswords.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, usersPasswords.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!usersPasswordsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UsersPasswords result = usersPasswordsRepository.save(usersPasswords);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, usersPasswords.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /users-passwords/:id} : Partial updates given fields of an existing usersPasswords, field will ignore if it is null
     *
     * @param id the id of the usersPasswords to save.
     * @param usersPasswords the usersPasswords to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usersPasswords,
     * or with status {@code 400 (Bad Request)} if the usersPasswords is not valid,
     * or with status {@code 404 (Not Found)} if the usersPasswords is not found,
     * or with status {@code 500 (Internal Server Error)} if the usersPasswords couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/users-passwords/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UsersPasswords> partialUpdateUsersPasswords(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody UsersPasswords usersPasswords
    ) throws URISyntaxException {
        log.debug("REST request to partial update UsersPasswords partially : {}, {}", id, usersPasswords);
        if (usersPasswords.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, usersPasswords.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!usersPasswordsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UsersPasswords> result = usersPasswordsRepository
            .findById(usersPasswords.getId())
            .map(existingUsersPasswords -> {
                if (usersPasswords.getSecret() != null) {
                    existingUsersPasswords.setSecret(usersPasswords.getSecret());
                }
                if (usersPasswords.getType() != null) {
                    existingUsersPasswords.setType(usersPasswords.getType());
                }
                if (usersPasswords.getPlatform() != null) {
                    existingUsersPasswords.setPlatform(usersPasswords.getPlatform());
                }

                return existingUsersPasswords;
            })
            .map(usersPasswordsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, usersPasswords.getId().toString())
        );
    }

    /**
     * {@code GET  /users-passwords} : get all the usersPasswords.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of usersPasswords in body.
     */
    //    @GetMapping("/users-passwords")
    //    public List<UsersPasswords> getAllUsersPasswords() {
    //        log.debug("REST request to get all UsersPasswords");
    //        return usersPasswordsRepository.findAll();
    //    }

    /**
     * {@code GET  /users-passwords/:id} : get the "id" usersPasswords.
     *
     * @param id the id of the usersPasswords to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the usersPasswords, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/users-passwords/{id}")
    public ResponseEntity<UsersPasswords> getUsersPasswords(@PathVariable UUID id) {
        log.debug("REST request to get UsersPasswords : {}", id);
        Optional<UsersPasswords> usersPasswords = usersPasswordsRepository.findById(id);

        final Optional<User> isUser = userService.getUserWithAuthorities();
        if (isUser.isEmpty()) {
            log.error("User is not logged in");
            return new ResponseEntity<UsersPasswords>(HttpStatus.FORBIDDEN);
        }
        final User user = isUser.get();
        if (usersPasswordsRepository.passwordBelongsToUser(user.getId(), id) == 1) {
            return ResponseUtil.wrapOrNotFound(usersPasswords);
        }

        return new ResponseEntity<UsersPasswords>(HttpStatus.FORBIDDEN);
    }

    /**
     * {@code DELETE  /users-passwords/:id} : delete the "id" usersPasswords.
     *
     * @param id the id of the usersPasswords to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/users-passwords/{id}")
    public ResponseEntity<Void> deleteUsersPasswords(@PathVariable UUID id) {
        log.debug("REST request to delete UsersPasswords : {}", id);

        final Optional<User> isUser = userService.getUserWithAuthorities();
        if (isUser.isEmpty()) {
            log.error("User is not logged in");
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        final User user = isUser.get();
        if (usersPasswordsRepository.passwordBelongsToUser(user.getId(), id) == 1) {
            usersPasswordsRepository.deleteById(id);
            return ResponseEntity
                .noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @GetMapping("/users-passwords/generate-key/{type}")
    public ResponseEntity<String> generateKey(@PathVariable String type) {
        String response = "";
        SmarthackKeyGenerator shkg = new SmarthackKeyGenerator();
        switch (type) {
            case "AES 128":
                {
                    response = shkg.generate_aes(128);
                    break;
                }
            case "AES 192":
                {
                    response = shkg.generate_aes(192);
                    break;
                }
            case "AES 256":
                {
                    response = shkg.generate_aes(256);
                    break;
                }
            case "Triple DES":
                {
                    response = shkg.generate_3des();
                    break;
                }
            case "RSA 1024":
                {
                    response = shkg.generate_rsa(1024);
                    break;
                }
            case "RSA 2048":
                {
                    response = shkg.generate_rsa(2048);
                    break;
                }
            case "ECC":
                {
                    response = shkg.generate_ecc();
                    break;
                }
        }
        return ResponseEntity.ok(response);
    }
}
