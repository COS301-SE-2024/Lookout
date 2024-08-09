package com.lookout.Lookout

import io.github.cdimascio.dotenv.Dotenv
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import kotlin.random.Random

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
///////////////////////////////db connection test/////////////////////////////////////
    @Test
    fun `database connection test`() {
        val result = jdbcTemplate.queryForObject("SELECT 1", Int::class.java)
        assert(result == 1)
    }
///////////////////////////////get all groups////////////////////////////////////=
    @Test
    fun `get all groups test`() {
        mockMvc.perform(get("/api/groups"))
            .andExpect(status().isOk)
    }

    
//////////////////////////////get groups by id//////////////////////////////////////=
    @Test
    fun `get group by id test`() {
        mockMvc.perform(get("/api/groups/5"))
            .andExpect(status().isOk)
    }

    @Test
    fun `get group by invalid id test`() {
        mockMvc.perform(get("/api/groups/-2"))
            .andExpect(status().isNotFound)
    }
////////////////////////////////////////////////////////////////////
    @Test
    fun `Get all groups with pagination`() {
        mockMvc.perform(get("/api/groups?page=0&size=10"))
            .andExpect(status().isOk)
    }
////////////////////////////create group////////////////////////////////////////
    //WORKS BUT CREATES A REAL GROUP
//    @Test
//    fun `create group test`() {
//        val groupJson = """
//            {
//              "name": "Unit Test",
//              "description": "This is a group for people interested in sharks",
//              "picture": "https://static.vecteezy.com/system/resources/thumbnails/021/790/965/small_2x/shark-and-water-icon-cute-sea-animal-illustration-treasure-island-hunter-picture-funny-pirate-party-element-for-kids-scary-fish-picture-with-toothy-opened-jaws-vector.jpg",
//              "userId": 2
//            }
//        """.trimIndent()
//
//        mockMvc.perform(
//            post("/api/groups")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(groupJson)
//        )
//            .andExpect(status().isCreated)
//    }

    @Test
    fun `Create a group with invalid data   `() {
        val groupJson = """
            {
              "name": "Invalid Group Test",
              "description": "This is a group with invalid data types",
              "picture": "https://invalid-picture-link.com",
              "user": {
                "id": "invalidUserId" // Invalid data type for id
              }
            }
        """.trimIndent()

        mockMvc.perform(
            post("/api/groups")
                .contentType(MediaType.APPLICATION_JSON)
                .content(groupJson)
        )
            .andExpect(status().isBadRequest)
    }
////////////////////////////update group////////////////////////////////////////
    //WORKS BUT UPDATES A REAL GROUP
//    @Test
//    fun `update group test`() {
//        val groupJson = """
//        {
//          "name": "Unit Test Updated Group",
//          "description": "This group has been updated"
//        }
//    """.trimIndent()
//
//        mockMvc.perform(
//            put("/api/groups/6")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(groupJson)
//        )
//            .andExpect(status().isOk)
//    }

    @Test
    fun `Update a group with invalid data   `() {
        val groupJson = """
            {
              "name": "Unit Test Updated Group",
              "description": "This group has been updated"
            }
        """.trimIndent()

        mockMvc.perform(
            put("/api/groups/-9")
                .contentType(MediaType.APPLICATION_JSON)
                .content(groupJson)
        )
            .andExpect(status().isNotFound)
    }
//////////////////////////////get group by user id//////////////////////////////////////
    @Test
    fun `Get a group by user id`() {
        mockMvc.perform(get("/api/groups/user/1"))
            .andExpect(status().isOk)
    }

    @Test
    fun `Get a group by invalid user id`() {
        mockMvc.perform(get("/api/groups/user/-45"))
            .andExpect(status().isNoContent)
    }

/////////////////////////////add member to group///////////////////////////////////////

    @Test
    fun `add member to group test`() {
        val memberJson = """
        {
          "groupId": 5,
          "userId": 1
        }
    """.trimIndent()

        mockMvc.perform(
            post("/api/groups/AddMemberToGroup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(memberJson)
        )
            .andExpect(status().isNoContent)
    }

    @Test
    fun `add invalid member to group test`() {
        val memberJson = """
        {
          "groupId": -2,
          "userId": -52
        }
    """.trimIndent()

        mockMvc.perform(
            post("/api/groups/AddMemberToGroup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(memberJson)
        )
            .andExpect(status().isBadRequest)
    }
///////////////////////////remove member from group/////////////////////////////////////////

    @Test
    fun `remove member from group test`() {
        val memberJson = """
        {
          "groupId": 5,
          "userId": 1
        }
    """.trimIndent()

        mockMvc.perform(
            post("/api/groups/RemoveMemberFromGroup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(memberJson)
        )
            .andExpect(status().isNoContent)
    }

    @Test
    fun `remove invalid member from group test`() {
        val memberJson = """
        {
          "groupId": -2,
          "userId": 52
        }
    """.trimIndent()

        mockMvc.perform(
            post("/api/groups/RemoveMemberFromGroup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(memberJson)
        )
            .andExpect(status().isBadRequest)
    }
///////////////////////////create post/////////////////////////////////////////
    //WORKS BUT CREATES A REAL POST
//    @Test
//    fun `create a post test`() {
//        val postJson = """
//        {
//          "userid": 52,
//          "groupid": 2,
//          "categoryid": 3,
//          "picture": "https://toppng.com/uploads/preview/safari-animals-png-cute-safari-animals-11562876426jornlea5ue.png",
//          "latitude": 123.123,
//          "longitude": 123.123,
//          "caption": "This is a test post"
//        }
//    """.trimIndent()
//
//        mockMvc.perform(
//            post("/api/posts/CreatePost")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(postJson)
//        )
//            .andExpect(status().isCreated)
//    }

    @Test
    fun `Create a post with invalid data   `() {
        val postJson = """
        {
          "userid": -52,
          "groupid": -2,
          "categoryid": 3,
          "picture": "https://toppng.com/uploads/preview/safari-animals-png-cute-safari-animals-11562876426jornlea5ue.png",
          "latitude": "invalidLatitude",
          "longitude": 123.123,
          "caption": "This is a test post"
        }
    """.trimIndent()

        mockMvc.perform(
            post("/api/posts/CreatePost")
                .contentType(MediaType.APPLICATION_JSON)
                .content(postJson)
        )
            .andExpect(status().isBadRequest)
    }
////////////////////////////get posts by user id////////////////////////////////////////
    @Test
    fun `get all posts by user id test`() {
        mockMvc.perform(get("/api/posts/user/52"))
            .andExpect(status().isOk)
    }

    @Test
    fun `get all posts by invalid user id test`() {
        mockMvc.perform(get("/api/posts/user/-9"))
            .andExpect(status().isOk)
    }
//////////////////////////get post by id//////////////////////////////////////////
    @Test
    fun `get post by id test`() {
        mockMvc.perform(get("/api/posts/4"))
            .andExpect(status().isOk)
    }

    @Test
    fun `get post by invalid id test`() {
        mockMvc.perform(get("/api/posts/-4"))
            .andExpect(status().isNotFound)
    }
////////////////////////////////////////////////////////////////////
    @Test
    fun `get posts by user id with pagination test`() {
        mockMvc.perform(get("/api/posts/user/52?page=0&size=10"))
            .andExpect(status().isOk)
    }
//////////////////////////get posts by group id//////////////////////////////////////////
    @Test
    fun `get posts by group id test`() {
        mockMvc.perform(get("/api/posts/group/2?page=0&size=10"))
            .andExpect(status().isOk)
    }

    @Test
    fun `get posts by invalid group id test`() {
        mockMvc.perform(get("/api/posts/group/-9?page=0&size=10"))
            .andExpect(status().isOk)
    }
/////////////////////////get posts by category id///////////////////////////////////////////
    @Test
    fun `get posts by category id test`() {
        mockMvc.perform(get("/api/posts/category/3?page=0&size=10"))
            .andExpect(status().isOk)
    }

    @Test
    fun `get posts by invalid category id test`() {
        mockMvc.perform(get("/api/posts/category/-3?page=0&size=10"))
            .andExpect(status().isOk)
    }
////////////////////////get all posts////////////////////////////////////////////

    @Test
    fun `get all posts`() {
        mockMvc.perform(get("/api/posts?page=0&size=10"))
            .andExpect(status().isOk)
    }
///////////////////////register a user/////////////////////////////////////////////
    //WORKS BUT CREATES A REAL USER
//    @Test
//    fun `post register user`(){
//
//        val postJson = """
//        {
//        "email": "Test12@email.com",
//        "username": "Test_User12",
//        "passcode": "Test@12345",
//        "role": "ADMIN"
//    }
//
//    """.trimIndent()
//
//        val updatedJson = addRandomValuesToJson(postJson)
//            mockMvc.perform(
//                post("/api/auth/register")
//                    .contentType(MediaType.APPLICATION_JSON)
//                    .content(updatedJson )
//            )
//                .andExpect(status().isOk)
//        }

    @Test
    fun `post invalid register user`(){
        val postJson = """
        {
        "email": "Test1256523email.com",
        "username": "Test_User12",
        "passcode": "Test@12345",
        "role": "ADMIN"
    }
            
        """.trimIndent()
    
            mockMvc.perform(
                post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(postJson)
            )
                .andExpect(status().isOk)
        }

/////////////////////////login a user///////////////////////////////////////////

    @Test
    fun `post invalid login user`(){
        val postJson = """
        {
        "email": "Test12@email.com",
        "passcode": "Test@31212345"
    } 
        
    """.trimIndent()

        mockMvc.perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(postJson)
        )
            .andExpect(status().is4xxClientError)
    }


//////////////////////////Update Post//////////////////////////////////////////
    @Test
    fun `incorrect update post test`() {
        val postJson = """
        {
          "id": -56, // Assuming this ID doesn't exist in your test data
          "userId": -52,
          "groupId": 2,
          "categoryId": 3,
          "picture": "https://newpicturelink.com/updated.png",
          "latitude": 124.124,
          "longitude": 124.124,
          "caption": "This is an updated test post 2"
        }
    """.trimIndent()

        mockMvc.perform(
            post("/api/posts/UpdatePost")
                .contentType(MediaType.APPLICATION_JSON)
                .content(postJson)
        )
            .andExpect(status().isBadRequest)
    }


    //WORKS BUT UPDATES A REAL POST
//    @Test
//    fun `update post test`() {
//        val postJson = """
//        {
//          "id": 19,
//          "userId": 52,
//          "groupId": 2,
//          "categoryId": 3,
//          "picture": "https://newpicturelink.com/updated.png",
//          "latitude": 124.124,
//          "longitude": 124.124,
//          "caption": "This is an updated test post 2"
//        }
//    """.trimIndent()
//
//        mockMvc.perform(
//            post("/api/posts/UpdatePost")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(postJson)
//        )
//            .andExpect(status().isNoContent)
//    }


///////////////////////////DELETES/////////////////////////////////////////
// DONT UNCOMMENT MAKE ACTUAL CHANGES TO DB


    // @Test
    // fun `delete invalid group test`() {
    //     mockMvc.perform(delete("/api/groups/-4"))
    //         .andExpect(status().isNotFound)
    // }


    // @Test
    // fun `delete invalid post test`() {
    //     mockMvc.perform(delete("/api/posts/4"))
    //         .andExpect(status().isNotFound)
    // }


/////////////////////////////////Save a post////////////////////////////////////////

    @Test
    fun `save a post`() {
        val postJson = """
    {
      "userId": 2,
      "postId": 8
    }
    """.trimIndent()

        mockMvc.perform(
            post("/api/savedPosts/SavePost")
                .contentType(MediaType.APPLICATION_JSON)
                .content(postJson)
        )
            .andExpect(status().isCreated)
            .andExpect(content().string("Successfully saved post"))
    }

    @Test
    fun `save an invalid post`() {
        val postJson = """
    {
      "userId": -2,
      "postId": -8
    }
    """.trimIndent()

        mockMvc.perform(
            post("/api/savedPosts/SavePost")
                .contentType(MediaType.APPLICATION_JSON)
                .content(postJson)
        )
            .andExpect(status().isBadRequest)
    }

/////////////////////////////////Unsave a post////////////////////////////////////////

    @Test
    fun `unsave a post`() {
        val postJson = """
    {
      "userId": 2,
      "postId": 8
    }
    """.trimIndent()

        mockMvc.perform(
            delete("/api/savedPosts/UnsavePost")
                .contentType(MediaType.APPLICATION_JSON)
                .content(postJson)
        )
            .andExpect(status().isNoContent)
            .andExpect(content().string("Successfully unsaved post"))
    }


    @Test
    fun `unsave an invalid post`() {
        val postJson = """
    {
      "userId": -2,
      "postId": -8
    }
    """.trimIndent()

        mockMvc.perform(
            delete("/api/savedPosts/UnsavePost")
                .contentType(MediaType.APPLICATION_JSON)
                .content(postJson)
        )
            .andExpect(status().isBadRequest)
    }

///////////////////////////////Get saved posts by user id//////////////////////////////////////

    @Test
    fun `get saved posts by user ID`() {
        mockMvc.perform(get("/api/savedPosts/user/1"))
            .andExpect(status().isOk)
    }

    @Test
    fun `get saved posts by invalid user ID`() {
        mockMvc.perform(get("/api/savedPosts/user/-1"))
            .andExpect(status().isNotFound)
    }

////////////////////check if a post is saved by a user////////////////////////////////////////

    @Test
    fun `check if a post is saved by a user`() {
        mockMvc.perform(get("/api/savedPosts/isPostSaved?userId=2&postId=8"))
            .andExpect(status().isOk)
    }

    @Test
    fun `check if an invalid post is saved by a user`() {
        mockMvc.perform(get("/api/savedPosts/isPostSaved?userId=-2&postId=-8"))
            .andExpect(status().isBadRequest)
    }

///////////////////////Count how many saves a post has////////////////////////////////////////

    @Test
    fun `count how many saves a post has`() {
        mockMvc.perform(get("/api/savedPosts/countSaves?postId=8"))
            .andExpect(status().isOk)
    }

    @Test
    fun `count how many saves an invalid post has`() {
        mockMvc.perform(get("/api/savedPosts/countSaves?postId=-8"))
            .andExpect(status().isBadRequest)
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
fun addRandomValuesToJson(json: String): String {
    val randomSuffix = Random.nextInt(1000, 9999)

    val updatedEmail = json.replace("\"email\": \"(.*?)\"".toRegex()) {
        val email = it.groupValues[1]
        "\"email\": \"${email + randomSuffix}\""
    }

    val updatedUsername = updatedEmail.replace("\"username\": \"(.*?)\"".toRegex()) {
        val username = it.groupValues[1]
        "\"username\": \"${username + randomSuffix}\""
    }

    val updatedPasscode = updatedUsername.replace("\"passcode\": \"(.*?)\"".toRegex()) {
        val passcode = it.groupValues[1]
        "\"passcode\": \"${passcode + randomSuffix}\""
    }

    return updatedPasscode
}

}
