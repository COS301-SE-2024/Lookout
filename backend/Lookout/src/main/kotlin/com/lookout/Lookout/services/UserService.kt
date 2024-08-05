package com.lookout.Lookout.service

import com.lookout.Lookout.dto.UserDto
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
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

    fun findByIdDto(id: Long): Optional<UserDto> {
        val user = userRepository.findById(id)
        return user.map { u ->
            UserDto(
                id = u.id,
                userName = u.userName ?: "",
                email = u.email ?: "",
                role = u.role?.name ?: "",
                isEnabled = u.isEnabled,
                username = u.username ?: "",
                authorities = u.authorities.map { it.authority },
                isAccountNonLocked = u.isAccountNonLocked,
                isCredentialsNonExpired = u.isCredentialsNonExpired,
                isAccountNonExpired = u.isAccountNonExpired
            )
        }
    }

    fun getUserPostsCount(id: Long): Int {
        return userRepository.getUserPostsCount(id)
    }

    fun getUserGroupsCount(id: Long): Int {
        return userRepository.getUserGroupsCount(id)
    }
}