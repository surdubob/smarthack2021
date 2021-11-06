package ro.unibuc.fmi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.UUID;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import ro.unibuc.fmi.IntegrationTest;
import ro.unibuc.fmi.domain.UsersPasswords;
import ro.unibuc.fmi.repository.UsersPasswordsRepository;

/**
 * Integration tests for the {@link UsersPasswordsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UsersPasswordsResourceIT {

    private static final String DEFAULT_SECRET = "AAAAAAAAAA";
    private static final String UPDATED_SECRET = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_PLATFORM = "AAAAAAAAAA";
    private static final String UPDATED_PLATFORM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/users-passwords";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private UsersPasswordsRepository usersPasswordsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUsersPasswordsMockMvc;

    private UsersPasswords usersPasswords;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UsersPasswords createEntity(EntityManager em) {
        UsersPasswords usersPasswords = new UsersPasswords().secret(DEFAULT_SECRET).type(DEFAULT_TYPE).platform(DEFAULT_PLATFORM);
        return usersPasswords;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UsersPasswords createUpdatedEntity(EntityManager em) {
        UsersPasswords usersPasswords = new UsersPasswords().secret(UPDATED_SECRET).type(UPDATED_TYPE).platform(UPDATED_PLATFORM);
        return usersPasswords;
    }

    @BeforeEach
    public void initTest() {
        usersPasswords = createEntity(em);
    }

    @Test
    @Transactional
    void createUsersPasswords() throws Exception {
        int databaseSizeBeforeCreate = usersPasswordsRepository.findAll().size();
        // Create the UsersPasswords
        restUsersPasswordsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(usersPasswords))
            )
            .andExpect(status().isCreated());

        // Validate the UsersPasswords in the database
        List<UsersPasswords> usersPasswordsList = usersPasswordsRepository.findAll();
        assertThat(usersPasswordsList).hasSize(databaseSizeBeforeCreate + 1);
        UsersPasswords testUsersPasswords = usersPasswordsList.get(usersPasswordsList.size() - 1);
        assertThat(testUsersPasswords.getSecret()).isEqualTo(DEFAULT_SECRET);
        assertThat(testUsersPasswords.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testUsersPasswords.getPlatform()).isEqualTo(DEFAULT_PLATFORM);
    }

    @Test
    @Transactional
    void createUsersPasswordsWithExistingId() throws Exception {
        // Create the UsersPasswords with an existing ID
        usersPasswordsRepository.saveAndFlush(usersPasswords);

        int databaseSizeBeforeCreate = usersPasswordsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUsersPasswordsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(usersPasswords))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsersPasswords in the database
        List<UsersPasswords> usersPasswordsList = usersPasswordsRepository.findAll();
        assertThat(usersPasswordsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUsersPasswords() throws Exception {
        // Initialize the database
        usersPasswordsRepository.saveAndFlush(usersPasswords);

        // Get all the usersPasswordsList
        restUsersPasswordsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(usersPasswords.getId().toString())))
            .andExpect(jsonPath("$.[*].secret").value(hasItem(DEFAULT_SECRET)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].platform").value(hasItem(DEFAULT_PLATFORM)));
    }

    @Test
    @Transactional
    void getUsersPasswords() throws Exception {
        // Initialize the database
        usersPasswordsRepository.saveAndFlush(usersPasswords);

        // Get the usersPasswords
        restUsersPasswordsMockMvc
            .perform(get(ENTITY_API_URL_ID, usersPasswords.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(usersPasswords.getId().toString()))
            .andExpect(jsonPath("$.secret").value(DEFAULT_SECRET))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.platform").value(DEFAULT_PLATFORM));
    }

    @Test
    @Transactional
    void getNonExistingUsersPasswords() throws Exception {
        // Get the usersPasswords
        restUsersPasswordsMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUsersPasswords() throws Exception {
        // Initialize the database
        usersPasswordsRepository.saveAndFlush(usersPasswords);

        int databaseSizeBeforeUpdate = usersPasswordsRepository.findAll().size();

        // Update the usersPasswords
        UsersPasswords updatedUsersPasswords = usersPasswordsRepository.findById(usersPasswords.getId()).get();
        // Disconnect from session so that the updates on updatedUsersPasswords are not directly saved in db
        em.detach(updatedUsersPasswords);
        updatedUsersPasswords.secret(UPDATED_SECRET).type(UPDATED_TYPE).platform(UPDATED_PLATFORM);

        restUsersPasswordsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUsersPasswords.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUsersPasswords))
            )
            .andExpect(status().isOk());

        // Validate the UsersPasswords in the database
        List<UsersPasswords> usersPasswordsList = usersPasswordsRepository.findAll();
        assertThat(usersPasswordsList).hasSize(databaseSizeBeforeUpdate);
        UsersPasswords testUsersPasswords = usersPasswordsList.get(usersPasswordsList.size() - 1);
        assertThat(testUsersPasswords.getSecret()).isEqualTo(UPDATED_SECRET);
        assertThat(testUsersPasswords.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testUsersPasswords.getPlatform()).isEqualTo(UPDATED_PLATFORM);
    }

    @Test
    @Transactional
    void putNonExistingUsersPasswords() throws Exception {
        int databaseSizeBeforeUpdate = usersPasswordsRepository.findAll().size();
        usersPasswords.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUsersPasswordsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, usersPasswords.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(usersPasswords))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsersPasswords in the database
        List<UsersPasswords> usersPasswordsList = usersPasswordsRepository.findAll();
        assertThat(usersPasswordsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUsersPasswords() throws Exception {
        int databaseSizeBeforeUpdate = usersPasswordsRepository.findAll().size();
        usersPasswords.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsersPasswordsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(usersPasswords))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsersPasswords in the database
        List<UsersPasswords> usersPasswordsList = usersPasswordsRepository.findAll();
        assertThat(usersPasswordsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUsersPasswords() throws Exception {
        int databaseSizeBeforeUpdate = usersPasswordsRepository.findAll().size();
        usersPasswords.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsersPasswordsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(usersPasswords)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UsersPasswords in the database
        List<UsersPasswords> usersPasswordsList = usersPasswordsRepository.findAll();
        assertThat(usersPasswordsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUsersPasswordsWithPatch() throws Exception {
        // Initialize the database
        usersPasswordsRepository.saveAndFlush(usersPasswords);

        int databaseSizeBeforeUpdate = usersPasswordsRepository.findAll().size();

        // Update the usersPasswords using partial update
        UsersPasswords partialUpdatedUsersPasswords = new UsersPasswords();
        partialUpdatedUsersPasswords.setId(usersPasswords.getId());

        partialUpdatedUsersPasswords.secret(UPDATED_SECRET).type(UPDATED_TYPE).platform(UPDATED_PLATFORM);

        restUsersPasswordsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUsersPasswords.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUsersPasswords))
            )
            .andExpect(status().isOk());

        // Validate the UsersPasswords in the database
        List<UsersPasswords> usersPasswordsList = usersPasswordsRepository.findAll();
        assertThat(usersPasswordsList).hasSize(databaseSizeBeforeUpdate);
        UsersPasswords testUsersPasswords = usersPasswordsList.get(usersPasswordsList.size() - 1);
        assertThat(testUsersPasswords.getSecret()).isEqualTo(UPDATED_SECRET);
        assertThat(testUsersPasswords.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testUsersPasswords.getPlatform()).isEqualTo(UPDATED_PLATFORM);
    }

    @Test
    @Transactional
    void fullUpdateUsersPasswordsWithPatch() throws Exception {
        // Initialize the database
        usersPasswordsRepository.saveAndFlush(usersPasswords);

        int databaseSizeBeforeUpdate = usersPasswordsRepository.findAll().size();

        // Update the usersPasswords using partial update
        UsersPasswords partialUpdatedUsersPasswords = new UsersPasswords();
        partialUpdatedUsersPasswords.setId(usersPasswords.getId());

        partialUpdatedUsersPasswords.secret(UPDATED_SECRET).type(UPDATED_TYPE).platform(UPDATED_PLATFORM);

        restUsersPasswordsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUsersPasswords.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUsersPasswords))
            )
            .andExpect(status().isOk());

        // Validate the UsersPasswords in the database
        List<UsersPasswords> usersPasswordsList = usersPasswordsRepository.findAll();
        assertThat(usersPasswordsList).hasSize(databaseSizeBeforeUpdate);
        UsersPasswords testUsersPasswords = usersPasswordsList.get(usersPasswordsList.size() - 1);
        assertThat(testUsersPasswords.getSecret()).isEqualTo(UPDATED_SECRET);
        assertThat(testUsersPasswords.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testUsersPasswords.getPlatform()).isEqualTo(UPDATED_PLATFORM);
    }

    @Test
    @Transactional
    void patchNonExistingUsersPasswords() throws Exception {
        int databaseSizeBeforeUpdate = usersPasswordsRepository.findAll().size();
        usersPasswords.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUsersPasswordsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, usersPasswords.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(usersPasswords))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsersPasswords in the database
        List<UsersPasswords> usersPasswordsList = usersPasswordsRepository.findAll();
        assertThat(usersPasswordsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUsersPasswords() throws Exception {
        int databaseSizeBeforeUpdate = usersPasswordsRepository.findAll().size();
        usersPasswords.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsersPasswordsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(usersPasswords))
            )
            .andExpect(status().isBadRequest());

        // Validate the UsersPasswords in the database
        List<UsersPasswords> usersPasswordsList = usersPasswordsRepository.findAll();
        assertThat(usersPasswordsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUsersPasswords() throws Exception {
        int databaseSizeBeforeUpdate = usersPasswordsRepository.findAll().size();
        usersPasswords.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUsersPasswordsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(usersPasswords))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UsersPasswords in the database
        List<UsersPasswords> usersPasswordsList = usersPasswordsRepository.findAll();
        assertThat(usersPasswordsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUsersPasswords() throws Exception {
        // Initialize the database
        usersPasswordsRepository.saveAndFlush(usersPasswords);

        int databaseSizeBeforeDelete = usersPasswordsRepository.findAll().size();

        // Delete the usersPasswords
        restUsersPasswordsMockMvc
            .perform(delete(ENTITY_API_URL_ID, usersPasswords.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UsersPasswords> usersPasswordsList = usersPasswordsRepository.findAll();
        assertThat(usersPasswordsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
