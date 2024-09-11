package com.lookout.Lookout.repository

import com.lookout.Lookout.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.Optional

interface UserRepository: JpaRepository<User,Long> {
    fun findByEmail(email: String): Optional<User>
    fun deleteByEmail(email: String)

    @Query("SELECT COUNT(p) FROM Posts p WHERE p.user.id = :id")
    fun getUserPostsCount(id: Long): Int

    @Query("SELECT COUNT(g) FROM GroupMembers g WHERE g.user.id = :id")
    fun getUserGroupsCount(id: Long): Int



}