package com.lookout.Lookout.service

import com.lookout.Lookout.entity.Posts
import com.lookout.Lookout.repository.PostRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.util.*

@Service
class PostsService(private val postRepository: PostRepository) {

    fun save(post: Posts): Posts {
        return postRepository.save(post)
    }

    fun findAll(pageable: Pageable): Page<Posts> {
        return postRepository.findAll(pageable)
    }

    fun findById(id: Long): Optional<Posts> {
        return postRepository.findById(id)
    }

    fun deleteById(id: Long) {
        return postRepository.deleteById(id)
    }
}