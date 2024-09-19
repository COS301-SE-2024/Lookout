package com.lookout.Lookout.controller

import com.lookout.Lookout.dto.SavePostRequest
import com.lookout.Lookout.dto.SavedPostDto
import com.lookout.Lookout.entity.SavedPosts
import com.lookout.Lookout.service.SavedPostsService
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.messaging.simp.SimpMessagingTemplate

@RestController
@RequestMapping("/api/savedPosts")
class SavedPostController(private val savedPostsService: SavedPostsService,  private val messagingTemplate: SimpMessagingTemplate ) {

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
    fun savePost(@RequestBody reqPost: SavePostRequest): ResponseEntity<String> {
        return try {
            val savedPost = savedPostsService.savePost(reqPost.userId, reqPost.postId)

            // Send WebSocket message to update clients
            val saveCount = savedPostsService.countSavesByPostId(reqPost.postId)
            val messagePayload = mapOf(
                "postId" to reqPost.postId,
                "saves" to saveCount,
                "isSaved" to true,
                "userId" to reqPost.userId
            )
            messagingTemplate.convertAndSend("/topic/post/${reqPost.postId}", messagePayload)

            ResponseEntity.status(HttpStatus.CREATED).body("Successfully saved post")
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString())
        }
    }

    @DeleteMapping("/UnsavePost")
    fun unsavePost(@RequestBody reqPost: SavePostRequest): ResponseEntity<String> {
        return try {
            val result = savedPostsService.unsavePost(reqPost.userId, reqPost.postId)
            if (result) {
                // Send WebSocket message to update clients
                val saveCount = savedPostsService.countSavesByPostId(reqPost.postId)
                val messagePayload = mapOf(
                    "postId" to reqPost.postId,
                    "saves" to saveCount,
                    "isSaved" to false,
                    "userId" to reqPost.userId
                )
                messagingTemplate.convertAndSend("/topic/post/${reqPost.postId}", messagePayload)

                ResponseEntity.status(HttpStatus.NO_CONTENT).body("Successfully unsaved post")
            } else {
                ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post is not saved by user")
            }
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.toString())
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

    @GetMapping("/user/{userId}")
    fun getSavedPostsByUser(@PathVariable userId: Long): ResponseEntity<List<SavedPostDto>> {
        return try {
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
    fun isPostSavedByUser(@RequestParam userId: Long, @RequestParam postId: Long): ResponseEntity<Boolean> {
        return try {
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

}