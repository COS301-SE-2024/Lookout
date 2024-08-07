package com.lookout.Lookout.controller

import com.lookout.Lookout.dto.GroupDto
import com.lookout.Lookout.dto.UserDto
import com.lookout.Lookout.entity.Groups
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*


@RestController
@RequestMapping("/api/users")
class UserController (private val userService: UserService){

    fun convertToDto(user: User): UserDto {
        return UserDto(
            id = user.id,
            userName = user.userName,
            email = user.email,
            profilePic = user.profilePic
        )
    }

    @GetMapping("user")
    fun getUser(): ResponseEntity<String>{
        return ResponseEntity.ok("User Login")
    }

    @PutMapping("/update-profile-pic")
    fun updateProfilePic(@RequestBody updateProfilePicRequest: UpdateProfilePicRequest): ResponseEntity<User> {
        val updatedUser = userService.updateProfilePic(updateProfilePicRequest.userId, updateProfilePicRequest.newProfilePicUrl)
        return ResponseEntity.ok(updatedUser)
    }

    @GetMapping("/{id}")
    fun getUserByID(@PathVariable id: Long): ResponseEntity<UserDto> {
        val user = userService.findById(id)
        return if (user.isPresent) {
            ResponseEntity.ok(convertToDto(user.get()))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/postsCount/{id}")
    fun getUserPostsCount(@PathVariable id: Long): ResponseEntity<Int> {
        try {
            userService.findById(id)
        } catch (e: NoSuchElementException) {
            return ResponseEntity.notFound().build()
        }
        val postsCount = userService.getUserPostsCount(id)
        return ResponseEntity.ok(postsCount)
    }

    @GetMapping("/groupsCount/{id}")
    fun getUserGroupsCount(@PathVariable id: Long): ResponseEntity<Int> {
        try {
            userService.findById(id)
        } catch (e: NoSuchElementException) {
            return ResponseEntity.notFound().build()
        }
        val groupsCount = userService.getUserGroupsCount(id)
        return ResponseEntity.ok(groupsCount)
    }
}

data class UpdateProfilePicRequest(
    val userId: Long,
    val newProfilePicUrl: String
)