package com.lookout.Lookout.repository

import com.lookout.Lookout.entity.Image
import org.springframework.data.jpa.repository.JpaRepository

interface ImageRepository: JpaRepository<Image, Long> {
}