package com.lookout.Lookout.service

import com.lookout.Lookout.entity.User
import io.github.cdimascio.dotenv.Dotenv
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.*
import java.util.function.Function
import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec


@Service
class JwtService {
    @Autowired
    lateinit var dotenv: Dotenv

    fun generateToken(user: User):String{
        var token = Jwts
            .builder()
            .setSubject(user.email)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + 60*60*100))
            .signWith(getSignInKey())
            .compact()

        return token
    }

    private fun getSignInKey(): SecretKey {
        val jwtToken = dotenv["JWT_SECRET_KEY"] ?: throw IllegalStateException("JWT_SECRET_KEY is null")

        // Split the JWT token into its three parts: header, payload, and signature
        val parts = jwtToken.split('.')
        if (parts.size != 3) {
            throw IllegalArgumentException("Invalid JWT token: $jwtToken")
        }

        // Extract the payload part (second part) which contains the secret key
        val payload = parts[1]

        // Decode the payload to get the secret key
        val keyBytes = Base64.getUrlDecoder().decode(payload)

        // Return the secret key
        return SecretKeySpec(keyBytes, "HmacSHA256")
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

    private fun isTokenExpired(token: String): Boolean {
        return extractExpiration(token).before(Date())
    }

    private fun extractExpiration(token: String): Date {
        return extractClaim(token) { claims: Claims -> claims.expiration }
    }

    public fun extractUserEmail(token: String): String{
        return extractClaim(token, Claims::getSubject)
    }

    public fun isValid(token: String, user: UserDetails): Boolean{
        val userName = extractUserEmail(token)
        return userName == user.username && !isTokenExpired(token)
    }
}