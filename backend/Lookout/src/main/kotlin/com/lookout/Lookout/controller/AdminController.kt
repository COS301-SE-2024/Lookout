package com.lookout.Lookout.controller

import com.lookout.Lookout.constants.ResponseConstant
import com.lookout.Lookout.dto.AuthenticationResponse
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.service.AuthenticationService
import com.lookout.Lookout.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("api/admin_only")
class AdminController(private val authService: AuthenticationService, private val userService: UserService) {
    @GetMapping("/admin")
    fun getAdmin(): String{
        return "Admin login"
    }
    @PostMapping("/add_user")
    fun register(@RequestBody request: User): ResponseEntity<AuthenticationResponse> {
        if (authService.addNewUser(request).message == ResponseConstant.USER_ALREADY_EXIST) {
            return ResponseEntity.badRequest().body(authService.addNewUser(request))
        }
        if (authService.addNewUser(request).message == ResponseConstant.REQUIRED_PARAMETERS_NOT_SET) {
            return ResponseEntity.badRequest().body(authService.addNewUser(request))
        }
        return ResponseEntity.ok(authService.addNewUser(request))
    }


    @DeleteMapping("/users/{email}")
    fun deleteUserByEmail(@PathVariable email: String?): ResponseEntity<String> {
        if (email.isNullOrBlank()) {
            return ResponseEntity.badRequest().body(ResponseConstant.REQUIRED_PARAMETERS_NOT_SET)
        }
        return try {
            val username = userService.loadUserByUsername(email)
            userService.deleteUser(username.username)
            ResponseEntity.ok(ResponseConstant.USER_REMOVED)
        } catch (userNotFound: UsernameNotFoundException) {
            ResponseEntity.badRequest().body(ResponseConstant.COULD_NOT_DELETE_USER)
        }
    }

}