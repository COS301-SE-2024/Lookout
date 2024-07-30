package com.lookout.Lookout.services

import com.lookout.Lookout.entity.*
import com.lookout.Lookout.repository.*
import org.springframework.stereotype.Service
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

@Service
class ImageService(private val imageRepository: ImageRepository, private val categoryRepository: CategoryRepository,
                   private val userRepository: UserRepository, private val groupRepository: GroupRepository,
                   private val savedPostsRepository: SavedPostRepository
) {
    fun savePost(post: Image): Image {
        return imageRepository.save(post)
    }

    fun getAllPosts(): List<Image> {
        return imageRepository.findAll()
    }

    fun getPostById(id: Long): Image? {
        return imageRepository.findById(id).orElse(null)
    }

    fun findCategoryById(id: Int): Categories? {
        return categoryRepository.findById(id).orElse(null)
    }

    fun findUserById(id: Long): User? {
        return userRepository.findById(id).orElse(null)
    }

    fun findGroupById(id: Long): Groups? {
        return groupRepository.findById(id).orElse(null)
    }

    fun findByCategoryId(categoryId: Long, pageable: Pageable): Page<Image> {
        return imageRepository.findByCategory_Id(categoryId, pageable)
    }

    fun findByUserId(userId: Long, pageable: Pageable): Page<Image>{
        return imageRepository.findByUser_Id(userId, pageable)
    }


    fun delete(post: Image) {
        // Delete related saved posts first
        val savedPosts = savedPostsRepository.findByPost(post)
        savedPosts.forEach { savedPostsRepository.delete(it) }

        // Delete the post
        imageRepository.delete(post)
    }

}