package com.lookout.Lookout.repository

import com.lookout.Lookout.entity.Posts
import com.lookout.Lookout.entity.SavedPosts
import com.lookout.Lookout.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SavedPostRepository : JpaRepository<SavedPosts, Long> {
    fun findByUserAndPost(user: User, post: Posts): SavedPosts?
    fun findAllByUser(user: User): List<SavedPosts>
    fun countByPost(post: Posts): Long


}
