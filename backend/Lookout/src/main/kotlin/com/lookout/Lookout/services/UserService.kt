package com.lookout.Lookout.service

import com.lookout.Lookout.entity.User
import com.lookout.Lookout.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*


@Service
class UserService: UserDetailsService {

    @Autowired
    private lateinit var userRepository: UserRepository

    @Throws(UsernameNotFoundException::class)
    override fun loadUserByUsername(username: String): UserDetails {
        return userRepository.findByEmail(username)
            .orElseThrow { UsernameNotFoundException("User is not valid") }
    }

    fun deleteUser(email: String) {
        userRepository.deleteByEmail(email)
    }

    fun findById(id: Long): Optional<User> {
        return userRepository.findById(id)
    }

    @Transactional
    fun updateProfilePic(userId: Long, newProfilePicUrl: String): User {
        val user = userRepository.findById(userId).orElseThrow { Exception("User not found") }
        user.profilePic = newProfilePicUrl
        return userRepository.save(user)
    }
}