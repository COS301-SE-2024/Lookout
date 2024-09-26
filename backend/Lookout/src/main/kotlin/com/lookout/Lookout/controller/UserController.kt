package com.lookout.Lookout.controller

import com.lookout.Lookout.dto.UpdateEmailRequest
import com.lookout.Lookout.dto.UpdateUsernameRequest
import com.lookout.Lookout.dto.UserDto
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.service.JwtService
import com.lookout.Lookout.service.UserService
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService,
    private val jwtService: JwtService
){

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
    fun updateProfilePic(@RequestBody updateProfilePicRequest: UpdateProfilePicRequest, request: HttpServletRequest): ResponseEntity<User> {
        val jwt = extractJwtFromCookies(request.cookies)

        val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

        val user = userEmail?.let { userService.loadUserByUsername(it) }
        var userId: Long = 0
        if (user is User) {
            println("User ID: ${user.id}")
            userId = user.id
        }
        val updatedUser = userService.updateProfilePic(userId, updateProfilePicRequest.newProfilePicUrl)
        return ResponseEntity.ok(updatedUser)
    }

    @PutMapping("/update-username")
    fun updateUsername(@RequestBody updateRequest: UpdateUsernameRequest, request: HttpServletRequest): ResponseEntity<User> {
        val jwt = extractJwtFromCookies(request.cookies)

        val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

        val user = userEmail?.let { userService.loadUserByUsername(it) }
        var userId: Long = 0
        if (user is User) {
            println("User ID: ${user.id}")
            userId = user.id
        }
        val updatedUser = userService.updateUsername(userId, updateRequest.newUsername)
        return ResponseEntity.ok(updatedUser)
    }

    @PutMapping("/update-email")
    fun updateEmail(@RequestBody updateRequest: UpdateEmailRequest, request: HttpServletRequest): ResponseEntity<User> {
        val jwt = extractJwtFromCookies(request.cookies)

        val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

        val user = userEmail?.let { userService.loadUserByUsername(it) }
        var userId: Long = 0
        if (user is User) {
            println("User ID: ${user.id}")
            userId = user.id
        }
        val updatedUser = userService.updateEmail(userId, updateRequest.newEmail)
        return ResponseEntity.ok(updatedUser)
    }

    @GetMapping("/")
    fun getUserByID(request: HttpServletRequest): ResponseEntity<UserDto> {
        val jwt = extractJwtFromCookies(request.cookies)

        val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

        val user = userEmail?.let { userService.loadUserByUsername(it) }
        var userId: Long = 0
        if (user is User) {
            println("User ID: ${user.id}")
            userId = user.id
        }
        val userresult = userService.findById(userId)
        return if (userresult.isPresent) {
            ResponseEntity.ok(convertToDto(userresult.get()))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/postsCount")
    fun getUserPostsCount(request: HttpServletRequest): ResponseEntity<Int> {
        var userId: Long = 0
        try {
            val jwt = extractJwtFromCookies(request.cookies)

            val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

            val user = userEmail?.let { userService.loadUserByUsername(it) }

            if (user is User) {
                println("User ID: ${user.id}")
                userId = user.id
            }
            userService.findById(userId)
        } catch (e: NoSuchElementException) {
            return ResponseEntity.notFound().build()
        }
        val postsCount = userService.getUserPostsCount(userId)
        return ResponseEntity.ok(postsCount)
    }



    @GetMapping("/groupsCount")
    fun getUserGroupsCount(request: HttpServletRequest): ResponseEntity<Int> {
        var userId: Long = 0
        try {
            val jwt = extractJwtFromCookies(request.cookies)

            val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

            val user = userEmail?.let { userService.loadUserByUsername(it) }

            if (user is User) {
                println("User ID: ${user.id}")
                userId = user.id
            }
            userService.findById(userId)
        } catch (e: NoSuchElementException) {
            return ResponseEntity.notFound().build()
        }
        val groupsCount = userService.getUserGroupsCount(userId)
        return ResponseEntity.ok(groupsCount)
    }

    // Helper method to extract JWT from request cookies
    private fun extractJwtFromCookies(cookies: Array<Cookie>?): String? {
        return cookies?.firstOrNull { it.name == "jwt" }?.value
    }
}

data class UpdateProfilePicRequest(
    val userId: Long,
    val newProfilePicUrl: String
)