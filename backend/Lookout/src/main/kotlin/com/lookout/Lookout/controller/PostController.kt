package com.lookout.Lookout.controller


import com.lookout.Lookout.dto.GroupDto
import com.lookout.Lookout.dto.PostDto
import com.lookout.Lookout.entity.CreatePost
import com.lookout.Lookout.entity.UpdatePost
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

    fun convertToDto(post: Posts): PostDto {
        return PostDto(
            id = post.id?:0,
            caption = post.caption.toString(),
            createdAt = post.createdAt.toString(),
            userId = post.user?.id ?: 0,
            username = post.user?.username.toString(),
            groupId = post.group?.id ?: 0,
            categoryId = post.category?.id ?: 0,
            picture = post.picture.toString(),
            latitude = post.latitude,
            longitude = post.longitude,
            description = post.category?.description.toString(),
            title = post.title.toString(),
            groupName = post.group?.name.toString(),
            groupDescription = post.group?.description.toString()
        )
    }

    // Get a post by ID
    @GetMapping("/{id}")
    fun getPostById(@PathVariable id: Long): ResponseEntity<PostDto> {
        val post = postService.findById(id)
        return if (post != null) {
            ResponseEntity.ok(convertToDto(post))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    // Create a post
    @PostMapping ("/CreatePost")
    fun createPost(@RequestBody post: CreatePost): ResponseEntity<PostDto> {
        try {
            val savedPost = postService.createPost(post)
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedPost))
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
    }

    // Delete a post
    @DeleteMapping("/{id}")
    fun deletePost(@PathVariable id: Long): ResponseEntity<Posts> {
        val post = postService.findById(id)
        return if (post != null) {
            postService.delete(post)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    // Get all posts
    @GetMapping
    fun getAllPosts(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<Page<PostDto>> {
        val pageable: Pageable = PageRequest.of(page, size)
        val posts = postService.findAll(pageable).map { post -> convertToDto(post)}
        return ResponseEntity.ok(posts)
    }

    // Get posts by User ID
    @GetMapping("/user/{userId}")
    fun getPostsByUserId(
        @PathVariable userId: Long,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<Page<PostDto>> {
        val pageable: Pageable = PageRequest.of(page, size)
        val posts = postService.findByUserId(userId, pageable).map { post -> convertToDto(post)}
        return ResponseEntity.ok(posts)
    }

    // Get posts by Group ID
    @GetMapping("/group/{groupId}")
    fun getPostsByGroupId(
        @PathVariable groupId: Long,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<Page<PostDto>> {
        val pageable: Pageable = PageRequest.of(page, size)
        val posts = postService.findByGroupId(groupId, pageable).map { post -> convertToDto(post)}
        return ResponseEntity.ok(posts)
    }

    // Get posts by Category ID
    @GetMapping("/category/{categoryId}")
    fun getPostsByCategoryId(
        @PathVariable categoryId: Long,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<Page<PostDto>> {
        val pageable: Pageable = PageRequest.of(page, size)
        val posts = postService.findByCategoryId(categoryId, pageable).map { post -> convertToDto(post)}
        return ResponseEntity.ok(posts)
    }

    // Update a post
    @PostMapping("/UpdatePost")
    fun updatePost(@RequestBody post: UpdatePost): ResponseEntity<PostDto>{
        val updatedPost = postService.updatePost(post)
        return if (updatedPost != null) {
            ResponseEntity.ok(convertToDto(updatedPost))
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }


}