package com.lookout.Lookout.service

import com.lookout.Lookout.entity.Categories
import com.lookout.Lookout.entity.CreatePost
import com.lookout.Lookout.entity.UpdatePost
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

    fun createPost(createPost: CreatePost){//: Posts {
        val user = userRepository.findById(createPost.userid).orElse(null)
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
//        val post = Posts(
//            user = user,
//            group = group,
//            category = category,
//            picture = createPost.picture,
//            latitude = createPost.latitude,
//            longitude = createPost.longitude,
//            caption = createPost.caption,
//            createdAt = Instant.now(),
//            title = createPost.title,
//        )
        //return postRepository.save(post)
    }

    fun findById(id: Long): Posts? {
        return postRepository.findById(id).orElse(null)
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

            return postRepository.save(post)
        }
        return null
    }
}