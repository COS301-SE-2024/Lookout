package com.lookout.Lookout.controller

import com.lookout.Lookout.dto.SavePostRequest
import com.lookout.Lookout.dto.SavedPostDto
import com.lookout.Lookout.entity.SavedPosts
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.service.JwtService
import com.lookout.Lookout.service.SavedPostsService
import com.lookout.Lookout.service.UserService
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/savedPosts")
class SavedPostController(
    private val savedPostsService: SavedPostsService,
    private val messagingTemplate: SimpMessagingTemplate,
    private val jwtService: JwtService,
    private val userService: UserService
) {

//    @GetMapping("/all")
//    fun getAllSavedPostsWithUsers(): ResponseEntity<List<SavedPostDto>> {
//        return try {
//            val savedPosts = savedPostsService.getAllSavedPostsWithUsers()
//            val savedPostDtos = savedPosts.map { convertToDto(it) }
//            ResponseEntity.ok(savedPostDtos)
//        } catch (e: Exception) {
//            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
//        }
//    }


    @GetMapping("/all", produces = [MediaType.TEXT_PLAIN_VALUE])
    fun getAllSavedPostsWithUsersCsv(): ResponseEntity<String> {
        return try {
            val savedPosts = savedPostsService.getAllSavedPostsWithUsers()
            val savedPostDtos = savedPosts.map { convertToDto(it) }

            // Create CSV content
            val csvBuilder = StringBuilder()
            csvBuilder.append("id,postid,userid\n")
            savedPostDtos.forEach { dto ->
                csvBuilder.append("${dto.savedPostId},${dto.postId},${dto.userId}\n")
            }

            ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(csvBuilder.toString())
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }

    @PostMapping("/SavePost")
    fun savePost(@RequestBody reqPost: SavePostRequest, request: HttpServletRequest): ResponseEntity<String> {
        try {
            val jwt = extractJwtFromCookies(request.cookies)
            val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

            val user = userEmail?.let { userService.loadUserByUsername(it) }

            if (user is User) {
                println("User Email: ${user.email}")

                val savedPost = savedPostsService.savePost(user.id, reqPost.postId)
                val saveCount = savedPostsService.countSavesByPostId(reqPost.postId)

                val messagePayload = mapOf(
                    "postId" to reqPost.postId,
                    "saves" to saveCount,
                    "isSaved" to true,
                    "userEmail" to user.email
                )

                println("Sending WebSocket message to /post/${reqPost.postId} with payload: $messagePayload")
                messagingTemplate.convertAndSend("/post/${reqPost.postId}", messagePayload)

                return ResponseEntity.status(HttpStatus.CREATED).body("Successfully saved post")
            } else {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found or invalid")
            }
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString())
        }
    }


    @DeleteMapping("/UnsavePost")
    fun unsavePost(@RequestBody reqPost: SavePostRequest, request: HttpServletRequest): ResponseEntity<String> {
         try {
            val jwt = extractJwtFromCookies(request.cookies)
            val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

            // Safely load the user
            val user = userEmail?.let { userService.loadUserByUsername(it) }

            // Ensure the user object is properly cast to the User class
            if (user is User) {
                println("User Email: ${user.email}")

                // Proceed to unsave the post with the user's ID
                val result = savedPostsService.unsavePost(user.id, reqPost.postId)
                if (result) {
                    val saveCount = savedPostsService.countSavesByPostId(reqPost.postId)
                    val messagePayload = mapOf(
                        "postId" to reqPost.postId,
                        "saves" to saveCount,
                        "isSaved" to false,
                        "userEmail" to user.email // Send email instead of userId
                    )

                    println("Sending WebSocket message to /post/${reqPost.postId} with payload: $messagePayload")
                    messagingTemplate.convertAndSend("/post/${reqPost.postId}", messagePayload)

                    return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Successfully unsaved post")
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post is not saved by user")
                }
            } else {
                // Handle case when user is not found or invalid
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found or invalid")
            }
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString())
        }
    }



//    @GetMapping("/user/{userId}")
//    fun getSavedPostsByUser(@PathVariable userId: Long): ResponseEntity<List<SavedPosts>> {
//        return try {
//            val savedPosts = savedPostsService.getSavedPostsByUser(userId)
//            ResponseEntity.ok(savedPosts)
//        } catch (e: IllegalArgumentException) {
//            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
//        }
//    }

    @GetMapping("/user")
    fun getSavedPostsByUser(request: HttpServletRequest): ResponseEntity<List<SavedPostDto>> {
        return try {
            var userId: Long = 0
            val jwt = extractJwtFromCookies(request.cookies)

            val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

            val user = userEmail?.let { userService.loadUserByUsername(it) }

            if (user is User) {
                println("User ID: ${user.id}")
                userId = user.id
            }
            val savedPosts = savedPostsService.getSavedPostsByUser(userId)
            val savedPostDtos = savedPosts.map { convertToDto(it) }
            ResponseEntity.ok(savedPostDtos)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }

    fun convertToDto(savedPost: SavedPosts): SavedPostDto {
        return SavedPostDto(
            savedPostId = savedPost.id,
            postId = savedPost.post?.id,
            postTitle = savedPost.post?.title,
            postCaption = savedPost.post?.caption,
            postLatitude = savedPost.post?.latitude,
            postLongitude = savedPost.post?.longitude,
            postPicture = savedPost.post?.picture,
            postCreatedAt = savedPost.post?.createdAt?.toString(),
            postCategoryDescription = savedPost.post?.category?.description,
            groupId = savedPost.post?.group?.id,
            groupName = savedPost.post?.group?.name,
            groupDescription = savedPost.post?.group?.description,
            groupIsPrivate = savedPost.post?.group?.isPrivate,
            groupPicture = savedPost.post?.group?.picture,
            groupCreatedAt = savedPost.post?.group?.createdAt?.toString(),
            groupUserId = savedPost.post?.group?.user?.id,
            groupUsername = savedPost.post?.group?.user?.username,
            groupUserEmail = savedPost.post?.group?.user?.email,
            userId = savedPost.user?.id,
            username = savedPost.user?.username,
            userEmail = savedPost.user?.email
        )
    }


    @GetMapping("/isPostSaved")
    fun isPostSavedByUser(@RequestParam postId: Long, request: HttpServletRequest): ResponseEntity<Boolean> {
        return try {
            var userId: Long = 0
            val jwt = extractJwtFromCookies(request.cookies)

            val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

            val user = userEmail?.let { userService.loadUserByUsername(it) }

            if (user is User) {
                println("User ID: ${user.id}")
                userId = user.id
            }
            val isSaved = savedPostsService.isPostSavedByUser(userId, postId)
            ResponseEntity.ok(isSaved)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
    }

    @GetMapping("/countSaves")
    fun countSavesByPostId(@RequestParam postId: Long): ResponseEntity<Long> {
        return try {
            val saveCount = savedPostsService.countSavesByPostId(postId)
            ResponseEntity.ok(saveCount)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
    }

    // Helper method to extract JWT from request cookies
    private fun extractJwtFromCookies(cookies: Array<Cookie>?): String? {
        return cookies?.firstOrNull { it.name == "jwt" }?.value
    }

}