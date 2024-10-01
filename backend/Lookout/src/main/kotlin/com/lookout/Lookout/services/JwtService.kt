package com.lookout.Lookout.service

import com.lookout.Lookout.entity.User
import io.github.cdimascio.dotenv.Dotenv
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.*
import java.util.function.Function
import javax.crypto.SecretKey
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication

@Service
class JwtService {

    @Autowired
    lateinit var dotenv: Dotenv

    private val logger = LoggerFactory.getLogger(JwtService::class.java)

    fun generateToken(user: User): String {
        val token = Jwts
            .builder()
            .setSubject(user.email)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + 60 * 60 * 1000)) // 1 hour expiration
            .signWith(getSignInKey())
            .compact()

        logger.info("Generated JWT Token for user: ${user.email}")
        return token
    }

    private fun getSignInKey(): SecretKey {
        val secret = dotenv["JWT_SECRET_KEY"]
            ?: throw IllegalStateException("JWT_SECRET_KEY is null")
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret))
    }

    private fun extractAllClaims(token: String): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(getSignInKey())
            .build()
            .parseClaimsJws(token)
            .body
    }

    fun <T> extractClaim(token: String, resolver: Function<Claims, T>): T {
        val claims = extractAllClaims(token)
        return resolver.apply(claims)
    }

    fun validateToken(token: String, userDetails: UserDetails): Boolean {
        val username = extractUserEmail(token)
        val valid = username == userDetails.username && !isTokenExpired(token)
        logger.info("Token validation: username match = ${username == userDetails.username}, token username = $username, userDetails username = ${userDetails.username}, not expired = ${!isTokenExpired(token)}")
        return valid
    }


    private fun isTokenExpired(token: String): Boolean {
        return extractExpiration(token).before(Date())
    }

    private fun extractExpiration(token: String): Date {
        return extractClaim(token) { claims: Claims -> claims.expiration }
    }

    public fun extractUserEmail(token: String): String {
        return extractClaim(token, Claims::getSubject)
    }

    fun getAuthentication(token: String, userDetails: UserDetails): Authentication {
        return UsernamePasswordAuthenticationToken(userDetails, null, userDetails.authorities)
    }


}

