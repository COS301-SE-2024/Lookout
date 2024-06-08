package com.lookout.Lookout.service

import com.lookout.Lookout.entity.Posts
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface PostsService {
    fun save(post: Posts): Posts
    fun findAll(pageable: Pageable): Page<Posts>
    fun deleteById(id: Int)
    // Add additional methods as needed, e.g., findByUserId, findByGroupId
}
