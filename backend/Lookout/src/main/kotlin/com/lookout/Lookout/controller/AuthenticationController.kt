package com.lookout.Lookout.controller

import com.lookout.Lookout.dto.AuthenticationResponse
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.service.AuthenticationService
import com.lookout.Lookout.service.JwtService
import com.lookout.Lookout.services.EmailService
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import java.util.*


@RestController
@RequestMapping("/api/auth/")
class AuthenticationController(
    private val authService: AuthenticationService,
    response: HttpServletResponse,
    private val emailService: EmailService,
    private val jwtService: JwtService,
    private val passwordEncoder: PasswordEncoder,
) {

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
                .secure(true)
                .path("/")
                .maxAge(60*60*1000)
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
                .secure(true)
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
            .secure(true)
            .path("/")
            .maxAge(0)
            .build()
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString())
        return ResponseEntity.ok(authResponse)
    }


    @GetMapping("/signup/google")
    fun grantCode(
        @RequestParam("code") code: String?,
        @RequestParam("scope") scope: String?,
        @RequestParam("authuser") authUser: String?,
        @RequestParam("prompt") prompt: String?,
        @RequestParam("error") error: String?
    ): ResponseEntity<Any> {
        if (error != null) {

            return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, "https://lookoutcapstone.xyz/login")
                .build()
        }
        return authService.processGrantCode(code)
    }

    @PostMapping("/reset-password")
    fun resetPassword(requestemail: HttpServletRequest): ResponseEntity<String> {
        val jwt = extractJwtFromCookies(requestemail.cookies)

        val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

        // Generate a unique token for password reset (this is a simple example)
        val resetToken = jwt
        val resetLink = "http://localhost:8080/reset-password?token=$resetToken"

        // Send the password reset email
        val emailContent = "Click the link below to reset your password:\n$resetLink"
        val emailSent: Boolean = emailService.sendEmail(userEmail, "Reset Your Password", emailContent)

        return if (emailSent) {
            ResponseEntity.ok("Password reset email sent successfully.")
        } else {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending password reset email.")
        }
    }

    data class ChangePasswordRequest(
        val token: String,
        val passcode: String
    )

    @PostMapping("/changepassword")
    fun changePassword(requestemail: HttpServletRequest,
                       @RequestBody changePasswordRequest: ChangePasswordRequest): ResponseEntity<String> {
        val jwt = extractJwtFromCookies(requestemail.cookies)

        val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

        // Extract token from the request body
        val jwtFromBody = changePasswordRequest.token

        // Check if tokens match
        if (jwt != jwtFromBody) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token.")
        }

        if (userEmail != null) {

            authService.changepass(changePasswordRequest, userEmail)
            return ResponseEntity.ok("Password has been changed successfully.")

        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User not found or token invalid.")
    }

    // Helper method to extract JWT from request cookies
    private fun extractJwtFromCookies(cookies: Array<Cookie>?): String? {
        return cookies?.firstOrNull { it.name == "jwt" }?.value
    }

}