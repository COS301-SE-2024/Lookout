package com.lookout.Lookout.service

import com.lookout.Lookout.entity.SavedPosts
import com.lookout.Lookout.repository.PostRepository
import com.lookout.Lookout.repository.SavedPostRepository
import com.lookout.Lookout.repository.UserRepository
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service

@Service
class SavedPostsService(
    private val savedPostRepository: SavedPostRepository,
    private val postRepository: PostRepository,
    private val userRepository: UserRepository,
    private val messagingTemplate: SimpMessagingTemplate  // Directly inject SimpMessagingTemplate
) {
    fun savePost(userId: Long, postId: Long): SavedPosts {
        val user = userRepository.findById(userId).orElseThrow { IllegalArgumentException("User not found") }
        val post = postRepository.findById(postId).orElseThrow { IllegalArgumentException("Post not found") }
        val existingSavedPost = savedPostRepository.findByUserAndPost(user, post)
        if (existingSavedPost != null) {
            throw IllegalArgumentException("Post is already saved for this user")
        }
        val savedPost = SavedPosts(user = user, post = post)
        val result = savedPostRepository.save(savedPost)
        broadcastSaveCount(postId) // Broadcast updated count after saving
        return result
    }

    fun unsavePost(userId: Long, postId: Long): Boolean {
        val user = userRepository.findById(userId).orElseThrow { IllegalArgumentException("User not found") }
        val post = postRepository.findById(postId).orElseThrow { IllegalArgumentException("Post not found") }
        val existingSavedPost = savedPostRepository.findByUserAndPost(user, post)
        return if (existingSavedPost != null) {
            savedPostRepository.delete(existingSavedPost)
            broadcastSaveCount(postId) // Broadcast updated count after unsaving
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

    private fun broadcastSaveCount(postId: Long) {
        val updatedCount = countSavesByPostId(postId)

        messagingTemplate.convertAndSend("/topic/post/$postId", updatedCount)
    }
}