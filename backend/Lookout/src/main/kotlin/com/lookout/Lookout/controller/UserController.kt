package com.lookout.Lookout.controller

import com.lookout.Lookout.dto.UpdateEmailRequest
import com.lookout.Lookout.dto.UpdateUsernameRequest
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.repository.UserRepository
import com.lookout.Lookout.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/")
class UserController(private val userService: UserService) {

    @GetMapping("user")
    fun getUser(): ResponseEntity<String> {
        return ResponseEntity.ok("User Login")
    }

    @PatchMapping("user/{id}/username")
    fun updateUsername(@PathVariable id: Long, @RequestBody updateRequest: UpdateUsernameRequest): ResponseEntity<User> {
        val updatedUser = userService.updateUsername(id, updateRequest.newUsername)
        return ResponseEntity.ok(updatedUser)
    }

    @PatchMapping("user/{id}/email")
    fun updateEmail(@PathVariable id: Long, @RequestBody updateRequest: UpdateEmailRequest): ResponseEntity<User> {
        val updatedUser = userService.updateEmail(id, updateRequest.newEmail)
        return ResponseEntity.ok(updatedUser)
    }
}
