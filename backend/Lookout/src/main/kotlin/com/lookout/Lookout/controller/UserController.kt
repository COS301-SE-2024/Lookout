package com.lookout.Lookout.controller

import com.lookout.Lookout.entity.User
import com.lookout.Lookout.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/users")
class UserController (private val userService: UserService){
    @GetMapping("user")
    fun getUser(): ResponseEntity<String>{
        return ResponseEntity.ok("User Login")
    }

    @PutMapping("/update-profile-pic")
    fun updateProfilePic(@RequestBody updateProfilePicRequest: UpdateProfilePicRequest): ResponseEntity<User> {
        val updatedUser = userService.updateProfilePic(updateProfilePicRequest.userId, updateProfilePicRequest.newProfilePicUrl)
        return ResponseEntity.ok(updatedUser)
    }
}

data class UpdateProfilePicRequest(
    val userId: Long,
    val newProfilePicUrl: String
)