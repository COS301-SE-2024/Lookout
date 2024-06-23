package com.lookout.Lookout

import io.github.cdimascio.dotenv.Dotenv
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status


@SpringBootTest(
	webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
	properties = [
		"spring.datasource.url=\${DB_URL}",
		"spring.datasource.username=\${DB_USER}",
		"spring.datasource.password=\${DB_PASS}"
	]
)

@AutoConfigureMockMvc
class LookoutApplicationTests {

    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Test
	fun contextLoads() {
	}

    @Test
    fun `database connection test`() {
        val result = jdbcTemplate.queryForObject("SELECT 1", Int::class.java)
        assert(result == 1)
    }

    @Test
    fun `get all groups test`() {
        mockMvc.perform(get("/api/groups"))
            .andExpect(status().isOk)
    }

    @Test
    fun `get group by id test`() {
        mockMvc.perform(get("/api/groups/2"))
            .andExpect(status().isOk)
    }

    @Test
    fun `Get all groups with pagination`() {
        mockMvc.perform(get("/api/groups?page=0&size=10"))
            .andExpect(status().isOk)
    }

    companion object {
        @JvmStatic
        @BeforeAll
        fun setup(): Unit {
            val dotenv = Dotenv.configure()
                .directory("./.env")
                .load()
            dotenv["DB_URL"]?.let { System.setProperty("DB_URL", it) }
            dotenv["DB_USER"]?.let { System.setProperty("DB_USER", it) }
            dotenv["DB_PASS"]?.let { System.setProperty("DB_PASS", it) }
        }
    }


}
