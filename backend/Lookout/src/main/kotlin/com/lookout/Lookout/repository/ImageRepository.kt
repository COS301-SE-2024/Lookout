package com.lookout.Lookout.repository

import com.lookout.Lookout.entity.Image
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface ImageRepository: JpaRepository<Image, Long> {
    fun findByUser_Id(userId: Long, pageable: Pageable): Page<Image>
    fun findByGroup_Id(groupId: Long, pageable: Pageable): Page<Image>
    fun findByCategory_Id(categoryId: Long, pageable: Pageable): Page<Image>
}