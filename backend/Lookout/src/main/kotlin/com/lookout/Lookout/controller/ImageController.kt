package com.lookout.Lookout.controller


import com.lookout.Lookout.dto.ImageRequest
import com.lookout.Lookout.entity.Image
import com.lookout.Lookout.services.ImageService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.net.URL
import java.util.*

@RestController
@RequestMapping("/api/image")
class ImageController(private val postService: ImageService) {

    @PostMapping("/create")
    fun createPost(@RequestBody imageRequest: ImageRequest): ResponseEntity<Image> {
        return try {
            val imageContent = if ((imageRequest.image?.startsWith("http://") == true) || (imageRequest.image?.startsWith("https://") == true)) {
                // Handle URL
                val url = URL(imageRequest.image)
                url.readBytes()
            } else {
                // Handle base64
                Base64.getDecoder().decode(imageRequest.image)
            }

            val category = postService.findCategoryById(imageRequest.categoryId)
                ?: return ResponseEntity(HttpStatus.BAD_REQUEST)

            val user = postService.findUserById(imageRequest.userId)
                ?: return ResponseEntity(HttpStatus.BAD_REQUEST)

            val group = postService.findGroupById(imageRequest.groupId)
                ?: return ResponseEntity(HttpStatus.BAD_REQUEST)

            val post = Image(caption = imageRequest.caption, title = imageRequest.title,
                category = category,
                user = user,
                group = group,
                picture = imageContent,
                latitude = imageRequest.latitude,
                longitude = imageRequest.longitude)
            val savedPost = postService.savePost(post)
            ResponseEntity(savedPost, HttpStatus.CREATED)
        } catch (e: IllegalArgumentException) {
            ResponseEntity(HttpStatus.BAD_REQUEST)
        } catch (e: Exception) {
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @PutMapping("/update/{id}")
    fun updateImage(@PathVariable id: Long, @RequestBody imageRequest: ImageRequest): ResponseEntity<Image> {
        return try {
            val existingImage = postService.getPostById(id)
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
            val updatedImage = Image(
                id = existingImage.id,
                caption = imageRequest.caption ?: existingImage.caption,
                title = imageRequest.title ?: existingImage.title,
                category = existingImage.category,
                user = existingImage.user,
                group = existingImage.group,
                picture = imageContent,
                latitude = imageRequest.latitude ?: existingImage.latitude,
                longitude = imageRequest.longitude ?: existingImage.longitude
            )

            val savedImage = postService.savePost(updatedImage)
            ResponseEntity(savedImage, HttpStatus.OK)
        } catch (e: IllegalArgumentException) {
            ResponseEntity(HttpStatus.BAD_REQUEST)
        } catch (e: Exception) {
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    @GetMapping("/{id}")
    fun getPostById(@PathVariable id: Long): ResponseEntity<Image> {
        val post = postService.getPostById(id)
        return if (post != null) {
            ResponseEntity(post, HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }

    @GetMapping("/all")
    fun getAllPosts(): ResponseEntity<List<Image>> {
        val posts = postService.getAllPosts()
        return ResponseEntity(posts, HttpStatus.OK)
    }
}