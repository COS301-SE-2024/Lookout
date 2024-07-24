package com.lookout.Lookout.services

import com.lookout.Lookout.entity.Categories
import com.lookout.Lookout.entity.Groups
import com.lookout.Lookout.repository.ImageRepository
import org.springframework.stereotype.Service
import com.lookout.Lookout.entity.Image
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.repository.CategoryRepository
import com.lookout.Lookout.repository.GroupRepository
import com.lookout.Lookout.repository.UserRepository

@Service
class ImageService(private val imageRepository: ImageRepository, private val categoryRepository: CategoryRepository,
                   private val userRepository: UserRepository, private val groupRepository: GroupRepository
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
}