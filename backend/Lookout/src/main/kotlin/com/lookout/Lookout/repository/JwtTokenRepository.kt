package com.lookout.Lookout.repository

import com.lookout.Lookout.entity.JwtToken
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface JwtTokenRepository: JpaRepository<JwtToken, Int> {

    @Query("SELECT t FROM JwtToken t JOIN t.user u WHERE u.id = :userId AND t.loggedOut = false")
    fun findAllTokensByUser(userId: Long): List<JwtToken>
}