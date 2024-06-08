package com.lookout.Lookout.service

import com.lookout.Lookout.entity.CreatePost
import com.lookout.Lookout.entity.Posts
import com.lookout.Lookout.repository.CategoryRepository
import com.lookout.Lookout.repository.GroupRepository
import com.lookout.Lookout.repository.PostRepository
import com.lookout.Lookout.repository.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.*

@Service
class PostsService(
    private val postRepository: PostRepository,
    private val userRepository: UserRepository,
    private val groupRepository: GroupRepository,
    private val categoryRepository: CategoryRepository
) {


    fun createPost(createPost: CreatePost): Posts {
        val user = userRepository.findById(createPost.userid).orElse(null)
        if (user == null) {
            throw IllegalArgumentException("User not found")
        }
        val group = groupRepository.findById(createPost.groupid).orElse(null)
        if (group == null) {
            throw IllegalArgumentException("Group not found")
        }
        val categoryId = categoryRepository.findById(createPost.categoryid)
        if (!categoryId.isPresent) {
            throw IllegalArgumentException("Category not found")
        }
        val post = Posts(
            user = user,
            group = group,
            categoryId = createPost.categoryid,
            picture = createPost.picture,
            latitude = createPost.latitude,
            longitude = createPost.longitude,
            caption = createPost.caption,
            createdAt = Instant.now()
        )
        return postRepository.save(post)
    }


    fun findAll(pageable: Pageable): Page<Posts> {
        return postRepository.findAll(pageable)
    }

    fun findByUserId(userId: Long, pageable: Pageable): Page<Posts>{
        return postRepository.findByUser_Id(userId, pageable)
    }

    fun findByGroupId(groupId: Long, pageable: Pageable): Page<Posts>{
        return postRepository.findByGroup_Id(groupId, pageable)
    }
}