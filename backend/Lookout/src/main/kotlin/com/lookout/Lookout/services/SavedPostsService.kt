package com.lookout.Lookout.service

import com.lookout.Lookout.entity.SavedPosts
import com.lookout.Lookout.repository.PostRepository
import com.lookout.Lookout.repository.SavedPostRepository
import com.lookout.Lookout.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service


@Service
class SavedPostsService(
    private val savedPostRepository: SavedPostRepository,
    private val postRepository: PostRepository,
    private val userRepository: UserRepository,

) {

    @Autowired
    private val messagingTemplate: SimpMessagingTemplate? = null

    fun sendWebSocketMessage(postId: Long, messagePayload: Map<String?, Any?>?) {

        messagingTemplate!!.convertAndSend("/post/$postId", messagePayload!!)
    }

    fun savePost(userId: Long, postId: Long): SavedPosts {
        val user = userRepository.findById(userId)
            .orElseThrow { IllegalArgumentException("User not found") }
        val post = postRepository.findById(postId)
            .orElseThrow { IllegalArgumentException("Post not found") }
        val existingSavedPost = savedPostRepository.findByUserAndPost(user, post)
        if (existingSavedPost != null) {
            throw IllegalArgumentException("Post is already saved for this user")
        }
        val savedPost = SavedPosts(user = user, post = post)
        val result = savedPostRepository.save(savedPost)
        return result
    }

    fun unsavePost(userId: Long, postId: Long): Boolean {
        val user = userRepository.findById(userId)
            .orElseThrow { IllegalArgumentException("User not found") }
        val post = postRepository.findById(postId)
            .orElseThrow { IllegalArgumentException("Post not found") }
        val existingSavedPost = savedPostRepository.findByUserAndPost(user, post)
        return if (existingSavedPost != null) {
            savedPostRepository.delete(existingSavedPost)
            true
        } else {
            false
        }
    }

    fun getSavedPostsByUser(userId: Long): List<SavedPosts> {
        val user = userRepository.findById(userId).orElseThrow { IllegalArgumentException("User not found") }
        return savedPostRepository.findAllByUser(user)
    }

    fun isPostSavedByUser(userId: Long, postId: Long): Boolean {
        val user = userRepository.findById(userId).orElseThrow { IllegalArgumentException("User not found") }
        val post = postRepository.findById(postId).orElseThrow { IllegalArgumentException("Post not found") }
        return savedPostRepository.findByUserAndPost(user, post) != null
    }

    fun countSavesByPostId(postId: Long): Long {
        val post = postRepository.findById(postId).orElseThrow { IllegalArgumentException("Post not found") }
        return savedPostRepository.countByPost(post)
    }

    fun getAllSavedPostsWithUsers(): List<SavedPosts> {
        return savedPostRepository.findAll()
    }


}