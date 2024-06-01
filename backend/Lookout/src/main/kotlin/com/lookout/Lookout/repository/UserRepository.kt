package com.lookout.Lookout.repository

import com.lookout.Lookout.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface UserRepository: JpaRepository<User,Long> {
    fun findByEmail(email: String): Optional<User>
    fun deleteByEmail(email: String)
}