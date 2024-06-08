package com.lookout.Lookout.controller

import com.lookout.Lookout.entity.Posts
import com.lookout.Lookout.service.PostsService
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/posts")
class PostController(private val postService: PostsService) {

    // Create a post
    @PostMapping
    fun createPost(@RequestBody post: Posts): ResponseEntity<Posts> {
        return try {
            val savedPost = postService.save(post)
            ResponseEntity.status(HttpStatus.CREATED).body(savedPost)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
    }

    // Delete a post
    @DeleteMapping("/{id}")
    fun deletePost(@PathVariable id: Int): ResponseEntity<Void> {
        postService.deleteById(id)
        return ResponseEntity.noContent().build()
    }

    // Get all posts
    @GetMapping
    fun getAllPosts(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<Page<Posts>> {
        val pageable: Pageable = PageRequest.of(page, size)
        val posts = postService.findAll(pageable)
        return ResponseEntity.ok(posts)
    }

    // Add additional endpoints as needed
}
