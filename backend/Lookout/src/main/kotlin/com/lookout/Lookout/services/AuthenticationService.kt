package com.lookout.Lookout.service

import com.lookout.Lookout.constants.ResponseConstant
import com.lookout.Lookout.dto.AuthenticationResponse
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.enums.UserRoles
import com.lookout.Lookout.repository.UserRepository
import io.github.cdimascio.dotenv.Dotenv
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class AuthenticationService(
    private val userRepository: UserRepository,
    private val jwtService: JwtService,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager
) {

    fun addNewUser(request: User): AuthenticationResponse {
        if (request.email?.let { userRepository.findByEmail(it).isPresent } == true) {
            return AuthenticationResponse(null, ResponseConstant.USER_ALREADY_EXIST)
        }

        if (request.email.isNullOrBlank()) {
            return AuthenticationResponse(null, ResponseConstant.REQUIRED_PARAMETERS_NOT_SET)
        }

        val user = User(
            userName = request.username,
            email = request.email,
            passcode = passwordEncoder.encode(request.passcode),
            role = request.role
        )

        val savedUser = userRepository.save(user)
        val jwt = jwtService.generateToken(savedUser)

        return AuthenticationResponse(jwt, "User registration was successful")
    }

    fun authenticate(request: User): AuthenticationResponse {
        try {
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(
                    request.email,
                    request.passcode
                )
            )
        } catch (e: Exception) {
            return AuthenticationResponse(null, "Authentication failed: ${e.message}")
        }

        val user = userRepository.findByEmail(request.email!!).orElseThrow {
            RuntimeException("User not found")
        }
        val jwt = jwtService.generateToken(user)

        return AuthenticationResponse(jwt, "User login was successful")
    }

    fun logout(request: User): AuthenticationResponse {
        val userOptional = request.email?.let { userRepository.findByEmail(it) }
        val user = userOptional?.orElseThrow { IllegalArgumentException("User not found") }
        return AuthenticationResponse(null, "Logout Successful!")
    }

    fun processGrantCode(code: String?): ResponseEntity<Any> {

        val dotenv = Dotenv.configure()
            .directory("../backend/Lookout/.env")
            .load()

        val clientSecret = dotenv["GOOGLE_CLIENT_SECRET"]
        val clientId = dotenv["GOOGLE_CLIENT_ID"]

        val restTemplate = RestTemplate()
        val params = mapOf(
            "code" to code,
            "client_id" to clientId,
            "client_secret" to clientSecret,
            "redirect_uri" to "http://localhost:8080/api/auth/signup/google",
            "grant_type" to "authorization_code"
        )
        val response = restTemplate.postForObject(
            "https://oauth2.googleapis.com/token",
            params,
            Map::class.java
        )
        val idToken = response?.get("id_token") as String
        val accessToken = response["access_token"] as String

        val userInfo = fetchUserInfo(accessToken)

        val email = userInfo["email"] as String
        val name = userInfo["name"] as String

        val userOptional = userRepository.findByEmail(email)
        val user = if (userOptional.isPresent) {
            userOptional.get()
        } else {
            val newUser = User(
                email = email,
                userName = name,
                role = UserRoles.ADMIN
            )
            userRepository.save(newUser)
        }

        val jwt = jwtService.generateToken(user)

        val cookie: ResponseCookie = ResponseCookie.from("jwt", jwt)
            .httpOnly(true)
            //.secure(true)
            .path("/")
            .maxAge(60 * 60 * 10)
            .build()

        val redirectUrl = "http://localhost:8080/email-handler?email=$email"

        return ResponseEntity.status(HttpStatus.FOUND)
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .header(HttpHeaders.LOCATION, redirectUrl)
            .build()
    }

    fun fetchUserInfo(accessToken: String): Map<String, Any> {
        val restTemplate = RestTemplate()
        val headers = HttpHeaders()
        headers.set("Authorization", "Bearer $accessToken")
        val entity = HttpEntity<String>(headers)
        val response = restTemplate.exchange(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            HttpMethod.GET,
            entity,
            Map::class.java
        )
        return response.body as? Map<String, Any> ?: emptyMap()
    }
}
