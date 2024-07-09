package com.lookout.Lookout.controller

import com.lookout.Lookout.entity.SavedPosts
import com.lookout.Lookout.service.SavedPostsService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/savedPosts")
class SavedPostController(private val savedPostsService: SavedPostsService) {

    @PostMapping("/SavePost")
    fun addPost(@RequestBody post: SavedPosts): ResponseEntity<SavedPosts> {
        return try {
            val savedPost = savedPostsService.savePost(post)
            ResponseEntity.status(HttpStatus.CREATED).body(savedPost)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
    }

    @DeleteMapping("/UnsavePost")
    fun unsavePost(@RequestParam userId: Long, @RequestParam postId: Long): ResponseEntity<Void> {
        return try {
            val result = savedPostsService.unsavePost(userId, postId)
            if (result) {
                ResponseEntity.status(HttpStatus.NO_CONTENT).build()
            } else {
                ResponseEntity.status(HttpStatus.NOT_FOUND).build()
            }
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        }
    }

    @GetMapping("/user/{userId}")
    fun getSavedPostsByUser(@PathVariable userId: Long): ResponseEntity<List<SavedPosts>> {
        return try {
            val savedPosts = savedPostsService.getSavedPostsByUser(userId)
            ResponseEntity.ok(savedPosts)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
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
}