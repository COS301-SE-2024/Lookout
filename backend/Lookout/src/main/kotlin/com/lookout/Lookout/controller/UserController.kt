package com.lookout.Lookout.controller

import com.lookout.Lookout.dto.GroupDto
import com.lookout.Lookout.dto.UpdateEmailRequest
import com.lookout.Lookout.dto.UpdateUsernameRequest
import com.lookout.Lookout.dto.UserDto
import com.lookout.Lookout.entity.Groups
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

import java.io.PrintWriter




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

//    @GetMapping("/all")
//    fun getAllUsers(): ResponseEntity<List<UserDto>> {
//        val users = userService.findAllUsers()
//        val userDtos = users.map { convertToDto(it) }
//        return ResponseEntity.ok(userDtos)
//    }

    @GetMapping("/all", produces = [MediaType.TEXT_PLAIN_VALUE])
    fun getAllUsers(): ResponseEntity<String> {
        val users = userService.findAllUsers()
        val userDtos = users.map { convertToDto(it) }

        // Create CSV content
        val csvBuilder = StringBuilder()
        csvBuilder.append("id,userName,email,profilePic\n")
        userDtos.forEach { dto ->
            csvBuilder.append("${dto.id},${dto.userName},${dto.email},${dto.profilePic}\n")
        }

        return ResponseEntity.ok()
            .contentType(MediaType.TEXT_PLAIN)
            .body(csvBuilder.toString())
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

    @PutMapping("/{id}/update-username")
    fun updateUsername(@PathVariable id: Long, @RequestBody updateRequest: UpdateUsernameRequest): ResponseEntity<User> {
        val updatedUser = userService.updateUsername(id, updateRequest.newUsername)
        return ResponseEntity.ok(updatedUser)
    }

    @PutMapping("/{id}/update-email")
    fun updateEmail(@PathVariable id: Long, @RequestBody updateRequest: UpdateEmailRequest): ResponseEntity<User> {
        val updatedUser = userService.updateEmail(id, updateRequest.newEmail)
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