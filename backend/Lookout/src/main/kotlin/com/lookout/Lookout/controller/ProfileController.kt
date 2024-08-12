package com.lookout.Lookout.controller


import com.lookout.Lookout.dto.ProfilePicRequest
import com.lookout.Lookout.entity.ProfilePic
import com.lookout.Lookout.services.ProfilePicServices
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.net.URL
import java.util.*

@RestController
@RequestMapping("/api/profile/pic")
class ProfileController(private val picService: ProfilePicServices) {

    @PostMapping("/create")
    fun createPost(@RequestBody imageRequest: ProfilePicRequest): ResponseEntity<ProfilePic> {
        return try {
            val imageContent = if ((imageRequest.image?.startsWith("http://") == true) || (imageRequest.image?.startsWith("https://") == true)) {
                // Handle URL
                val url = URL(imageRequest.image)
                url.readBytes()
            } else {
                // Handle base64
                Base64.getDecoder().decode(imageRequest.image)
            }

            val user = picService.findUserById(imageRequest.userId)
                ?: return ResponseEntity(HttpStatus.BAD_REQUEST)

            val profilepicture = ProfilePic(
                user = user,
                picture = imageContent)
            val savedPost = picService.savePic(profilepicture)
            ResponseEntity(savedPost, HttpStatus.CREATED)
        } catch (e: IllegalArgumentException) {
            ResponseEntity(HttpStatus.BAD_REQUEST)
        } catch (e: Exception) {
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @PutMapping("/update/{id}")
    fun updateImage(@PathVariable id: Long, @RequestBody imageRequest: ProfilePicRequest): ResponseEntity<ProfilePic> {
        return try {
            val existingImage = picService.getPicById(id)
                ?: return ResponseEntity(HttpStatus.NOT_FOUND)

            val imageContent = if (!imageRequest.image.isNullOrEmpty()) {
                if (imageRequest.image.startsWith("http://") || imageRequest.image.startsWith("https://")) {
                    // Handle URL
                    val url = URL(imageRequest.image)
                    url.readBytes()
                } else {
                    // Handle base64
                    Base64.getDecoder().decode(imageRequest.image)
                }
            } else {
                // Use the existing image content if not provided in the request
                existingImage.picture
            }

            // Use existing values for the immutable fields
            val updatedImage = ProfilePic(
                id = existingImage.id,
                user = existingImage.user,
                picture = imageContent,
            )

            val savedImage = picService.savePic(updatedImage)
            ResponseEntity(savedImage, HttpStatus.OK)
        } catch (e: IllegalArgumentException) {
            ResponseEntity(HttpStatus.BAD_REQUEST)
        } catch (e: Exception) {
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    @GetMapping("/{id}")
    fun getPostById(@PathVariable id: Long): ResponseEntity<ProfilePic> {
        val post = picService.getPicById(id)
        return if (post != null) {
            ResponseEntity(post, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    // Get profile picture by User ID
    @GetMapping("/user/{userId}")
    fun getPostsByUserId(
        @PathVariable userId: Long,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<Page<ProfilePic>> {
        val pageable: Pageable = PageRequest.of(page, size)
        val posts = picService.findByUserId(userId, pageable)
        return ResponseEntity.ok(posts)
    }

    @GetMapping("/all")
    fun getAllPosts(): ResponseEntity<List<ProfilePic>> {
        val posts = picService.getAllPic()
        return ResponseEntity(posts, HttpStatus.OK)
    }

    // Delete a post
    @DeleteMapping("/{id}")
    fun deletePost(@PathVariable id: Long): ResponseEntity<ProfilePic> {
        val post = picService.getPicById(id)
        return if (post != null) {
            picService.delete(post)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}