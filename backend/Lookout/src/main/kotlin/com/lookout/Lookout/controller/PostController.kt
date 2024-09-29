package com.lookout.Lookout.controller


import com.lookout.Lookout.dto.PostDto
import com.lookout.Lookout.entity.CreatePost
import com.lookout.Lookout.entity.UpdatePost
import com.lookout.Lookout.entity.Posts
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.service.JwtService
import com.lookout.Lookout.service.PostsService
import com.lookout.Lookout.service.UserService
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
//import com.lookout.Lookout.service.UserService
import org.springframework.web.bind.annotation.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.*
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping("/api/posts")
class PostController(
    private val postService: PostsService,
    private val jwtService: JwtService,
    private val userService: UserService
) {

    fun convertToDto(post: Posts): PostDto {
        return PostDto(
            id = post.id ?: 0,
            caption = post.caption.toString(),
            createdAt = post.createdAt.toString(),
            userId = post.user?.id ?: 0,
            username = post.user?.userName.toString(),
            profilePic = post.user?.profilePic.toString(),
            groupId = post.group?.id ?: 0,
            groupName = post.group?.name.toString(),
            groupDescription = post.group?.description.toString(),
            groupPicture = post.group?.picture.toString(),
            admin = post.group?.user?.username.toString(),
            description = post.category?.description.toString(),
            title = post.title.toString(),
            categoryId = post.category?.id ?: 0,
            picture = post.picture.toString(),
            latitude = post.latitude,
            longitude = post.longitude,

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
    fun createPost(@RequestBody post: CreatePost, request: HttpServletRequest,): ResponseEntity<PostDto> {
        try {
            val jwt = extractJwtFromCookies(request.cookies)

            val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

            val user = userEmail?.let { userService.loadUserByUsername(it) }
            var userId: Long = 0
            if (user is User) {
                println("User ID: ${user.id}")
                userId = user.id
            }
            val savedPost = postService.createPost(post, userId)
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedPost))
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
    }

    // Delete a post
    @DeleteMapping("/{id}")
    fun deletePost(@PathVariable id: Long): ResponseEntity<Void> {
        val post = postService.findById(id)
        return if (post != null) {
            postService.deletePost(post)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }


    // Get all posts
    @GetMapping
    fun getAllPosts(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "100") size: Int
    ): ResponseEntity<Page<PostDto>> {
        val pageable: Pageable = PageRequest.of(page, size)
        val posts = postService.findAll(pageable).map { post -> convertToDto(post)}
        return ResponseEntity.ok(posts)
    }

    // Get all posts in csv format
    @GetMapping("/all", produces = [MediaType.TEXT_PLAIN_VALUE])
    fun getAllPostsCsv(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "100") size: Int
    ): ResponseEntity<String> {
        val pageable: Pageable = PageRequest.of(page, size)
        val postPage = postService.findAll(pageable)
        val posts = postPage.content.map { post -> convertToDto(post) }

        // Create CSV content
        val csvBuilder = StringBuilder()
        csvBuilder.append("id,userid,groupId,categoryId,title,caption,picture,latitude,longitude,createdAt\n")
        posts.forEach { dto ->
            csvBuilder.append("${dto.id},${dto.userId},${dto.groupId},${dto.categoryId},${dto.title},${dto.caption},${dto.picture},${dto.latitude},${dto.longitude},${dto.createdAt}\n")
        }

        return ResponseEntity.ok()
            .contentType(MediaType.TEXT_PLAIN)
            .body(csvBuilder.toString())
    }

    // Get posts by User ID
    @GetMapping("/user")
    fun getPostsByUserId(
        request: HttpServletRequest,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<Page<PostDto>> {

        val jwt = extractJwtFromCookies(request.cookies)

        val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

        val user = userEmail?.let { userService.loadUserByUsername(it) }
        var userId: Long = 0
        if (user is User) {
            println("User ID: ${user.id}")
            userId = user.id
        }

        val pageable: Pageable = PageRequest.of(page, size)
        val posts = userId?.let { postService.findByUserId(it, pageable).map { post -> convertToDto(post)} }
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

    // Get posts by User ID
    @GetMapping("/recommend_posts")
    fun getRecommendedPosts(
        request: HttpServletRequest,
        restTemplate: RestTemplate
    ): ResponseEntity<String> {

        // Extract JWT from cookies
        val jwt = extractJwtFromCookies(request.cookies)

        // Extract user email from JWT
        val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

        // Find user by email
        val user = userEmail?.let { userService.loadUserByUsername(it) }
        var userId: Long = 0
        if (user is User) {
            println("User ID: ${user.id}")
            userId = user.id
        }

        // Prepare API call to your Python model
        val pythonApiUrl = "https://lookoutcapstone.xyz/recommend_posts?user_id=$userId&top_n=10"

        // Perform GET request to the Python model API
        val headers = HttpHeaders()
        val entity = HttpEntity<String>(headers)

        val response: ResponseEntity<String> = restTemplate.exchange(
            pythonApiUrl,
            HttpMethod.GET,
            entity,
            String::class.java
        )

        // Return the response from the Python model API as is
        return ResponseEntity.ok(response.body)
    }


    // Helper method to extract JWT from request cookies
    private fun extractJwtFromCookies(cookies: Array<Cookie>?): String? {
        return cookies?.firstOrNull { it.name == "jwt" }?.value
    }


}