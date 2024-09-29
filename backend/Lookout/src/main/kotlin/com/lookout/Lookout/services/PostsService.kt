package com.lookout.Lookout.service

import com.lookout.Lookout.entity.Categories
import com.lookout.Lookout.entity.CreatePost
import com.lookout.Lookout.entity.UpdatePost
import com.lookout.Lookout.entity.Posts
import com.lookout.Lookout.repository.*
import jakarta.transaction.Transactional
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
    private val categoryRepository: CategoryRepository,
    private val savedPostsRepository: SavedPostRepository
) {

    fun createPost(createPost: CreatePost, userId: Long): Posts {
        val user = userRepository.findById(userId).orElse(null)
        if (user == null) {
            throw IllegalArgumentException("User not found")
        }
        val group = groupRepository.findById(createPost.groupid).orElse(null)
        if (group == null) {
            throw IllegalArgumentException("Group not found")
        }
        val category = categoryRepository.findById(createPost.categoryid).orElse(null)
        if (category == null) {
            throw IllegalArgumentException("Category not found")
        }
        val post = Posts(
            user = user,
            group = group,
            category = category,
            picture = createPost.picture,
            latitude = createPost.latitude,
            longitude = createPost.longitude,
            caption = createPost.caption,
            createdAt = Instant.now(),
            title = createPost.title
        )
        return postRepository.save(post)
    }

    fun removeGroupIdFromPosts(groupId: Long) {
        postRepository.setGroupIdToNullForPostsByGroupId(groupId)
    }

    fun findById(id: Long): Posts? {
        return postRepository.findById(id).orElse(null)
    }

    @Transactional
    fun deletePost(post: Posts) {
        // First, delete all rows in the saved_posts table referencing this post
        post.id?.let { savedPostsRepository.deleteByPostId(it) }

        // Then, delete the post itself
        postRepository.delete(post)
    }

    fun delete(post: Posts) {
        postRepository.delete(post)
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

    fun findByCategoryId(categoryId: Long, pageable: Pageable): Page<Posts>{
        return postRepository.findByCategory_Id(categoryId, pageable)
    }

    fun updatePost(updatePost: UpdatePost): Posts? {
        val postOptional: Optional<Posts> = postRepository.findById(updatePost.id)
        if (postOptional.isPresent) {
            val post = postOptional.get()

            updatePost.caption.let { post.caption = it }
            updatePost.title.let { post.title = it }

            return postRepository.save(post)
        }
        return null
    }
}