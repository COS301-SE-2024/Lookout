package com.lookout.Lookout.controller

import com.google.gson.Gson
import com.lookout.Lookout.dto.AuthenticationResponse
import com.lookout.Lookout.dto.UserLoginRequest
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.service.AuthenticationService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth/")
class AuthenticationController(private val authService: AuthenticationService) {

    @PostMapping("login")
    fun login(
        @RequestBody request: User?
    ): ResponseEntity<AuthenticationResponse> {
        if (request != null) {
            println(request.email)
            println(request.passcode)
        }
        return ResponseEntity.ok(authService.authenticate(request!!))
    }
}