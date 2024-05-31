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
        var secretKey = dotenv["JWT_SECRET_KEY"]
        val keyBytes = Base64.getUrlDecoder().decode(secretKey)
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