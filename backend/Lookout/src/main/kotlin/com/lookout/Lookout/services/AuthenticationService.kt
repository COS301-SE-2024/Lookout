package com.lookout.Lookout.service

import com.lookout.Lookout.constants.ResponseConstant
import com.lookout.Lookout.dto.AuthenticationResponse
import com.lookout.Lookout.entity.User
import com.lookout.Lookout.repository.UserRepository
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthenticationService(private val userRepository: UserRepository,
    private val jwtService: JwtService,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager

) {
    fun addNewUser(request: User): AuthenticationResponse{
        // Check if user already exists. If exists then authenticate the user
        if (request.email?.let { userRepository.findByEmail(it).isPresent } == true) {
            return AuthenticationResponse(null, ResponseConstant.USER_ALREADY_EXIST)
        }

        // Check if the parameters are all set
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
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(
                request.email,
                request.passcode
            )
        )

        //val user = request.email.let { request.email?.let { it1 -> userRepository.findByEmail(it1).orElseThrow() } }
        val user = userRepository.findByEmail(request.email!!).orElseThrow()
        val jwt = user?.let { jwtService.generateToken(it) }


        return AuthenticationResponse(jwt, "User login was successful")
    }

    fun logout(request: User): AuthenticationResponse {
        val userOptional = request.email?.let { userRepository.findByEmail(it) }
        val user = userOptional?.orElseThrow { IllegalArgumentException("User not found") }
        if (user == null) {
            return AuthenticationResponse(null, "User not found")
        }
        return AuthenticationResponse(null, "Logout Successful!")
    }


}