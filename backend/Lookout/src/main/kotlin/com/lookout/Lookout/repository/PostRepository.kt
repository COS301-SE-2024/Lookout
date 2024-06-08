package com.lookout.Lookout.repository

import com.lookout.Lookout.entity.Posts
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

@Repository
interface PostRepository : JpaRepository<Posts, Int>{
    fun findByUser_Id(userId: Long, pageable: Pageable): Page<Posts>
    fun findByGroup_Id(groupId: Long, pageable: Pageable): Page<Posts>
}