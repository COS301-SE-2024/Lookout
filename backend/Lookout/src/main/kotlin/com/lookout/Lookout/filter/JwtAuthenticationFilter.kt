package com.lookout.Lookout.filter

import com.lookout.Lookout.service.JwtService
import com.lookout.Lookout.service.UserService
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userDetailsService: UserService

): OncePerRequestFilter() {
    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {

        var token: String? = null
        var username: String? = null

        if (request.cookies != null) {
            for (cookie in request.cookies) {
                if (cookie.name.equals("jwt")) {
                    token = cookie.value
                }
            }
        }

        if(token == null){
            filterChain.doFilter(request, response)
            return;
        }

        username = jwtService.extractUserEmail(token)

        if (username != null) {
            try {
                val userDetails: UserDetails = userDetailsService.loadUserByUsername(username)

                if (jwtService.isValid(token, userDetails)) {
                    val authToken = UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.authorities
                    )

                    authToken.details = WebAuthenticationDetailsSource().buildDetails(request)

                    SecurityContextHolder.getContext().authentication = authToken

                }
            } catch (e: UsernameNotFoundException) {
                logger.error("User not found: $username")
            }
        }
        filterChain.doFilter(request, response)
    }

}