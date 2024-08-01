package com.lookout.Lookout.repository

import com.lookout.Lookout.entity.ProfilePic
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface ProfilePicRepository: JpaRepository<ProfilePic, Long> {
    fun findByUser_Id(userId: Long, pageable: Pageable): Page<ProfilePic>
}