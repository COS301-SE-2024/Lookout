package com.lookout.Lookout.controller

import com.lookout.Lookout.dto.AuthenticationResponse
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.service.AuthenticationService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/auth/")
class AuthenticationController(private val authService: AuthenticationService, response: HttpServletResponse) {

    @PostMapping("login")
    fun login(
        @RequestBody request: User,
        response: HttpServletResponse
    ): ResponseEntity<AuthenticationResponse> {
        val authResponse = authService.authenticate(request)
        if (authResponse.token != null) {
            // set accessToken to cookie header
            val cookie: ResponseCookie = ResponseCookie.from("jwt", authResponse.token)
                .httpOnly(true)
                .path("/")
                .maxAge(60*60*10)
                .build()
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString())
        }
        return ResponseEntity.ok(authResponse)
    }

    @PostMapping("register")
    fun register(@RequestBody request: User, response: HttpServletResponse): ResponseEntity<AuthenticationResponse> {
        val authResponse = authService.addNewUser(request)
        if (authResponse.token != null) {
            // set accessToken to cookie header
            val cookie: ResponseCookie = ResponseCookie.from("jwt", authResponse.token)
                .httpOnly(true)
                .path("/")
                .maxAge(60*60*10)
                .build()
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString())
        }
        return ResponseEntity.ok(authResponse)
    }

    @PostMapping("logout")
    fun logout(@RequestBody request: User, response: HttpServletResponse): ResponseEntity<AuthenticationResponse> {
        val authResponse = authService.logout(request)
        val cookie = ResponseCookie.from("jwt", "")
            .httpOnly(true)
            .path("/")
            .maxAge(0)
            .build()
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString())
        return ResponseEntity.ok(authResponse)
    }
}