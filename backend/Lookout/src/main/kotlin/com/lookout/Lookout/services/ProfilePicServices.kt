package com.lookout.Lookout.services

import com.lookout.Lookout.entity.*
import com.lookout.Lookout.repository.*
import org.springframework.stereotype.Service
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

@Service
class ProfilePicServices(private val imageRepository: ProfilePicRepository, private val userRepository: UserRepository
) {
    fun savePic(post: ProfilePic): ProfilePic {
        return imageRepository.save(post)
    }

    fun getAllPic(): List<ProfilePic> {
        return imageRepository.findAll()
    }

    fun getPicById(id: Long): ProfilePic? {
        return imageRepository.findById(id).orElse(null)
    }

    fun findUserById(id: Long): User? {
        return userRepository.findById(id).orElse(null)
    }

    fun findByUserId(userId: Long, pageable: Pageable): Page<ProfilePic>{
        return imageRepository.findByUser_Id(userId, pageable)
    }


    fun delete(post: ProfilePic) {
        imageRepository.delete(post)
    }

}