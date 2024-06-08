package com.lookout.Lookout.controller


import com.lookout.Lookout.entity.CreatePost
import com.lookout.Lookout.entity.Groups
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.entity.Posts
import com.lookout.Lookout.service.PostsService
//import com.lookout.Lookout.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable

@RestController
@RequestMapping("/api/posts")
class PostController(private val postService: PostsService) {


    // Create a post
    @PostMapping ("/CreatePost")
    fun createPost(@RequestBody post: CreatePost): ResponseEntity<Posts> {
        try {
            val savedPost = postService.createPost(post)
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPost)
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
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

    // Get post by User Id
    // Get post by Group Id
    // Update a post




}