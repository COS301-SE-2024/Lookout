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
import jakarta.servlet.http.Cookie
import org.springframework.web.filter.OncePerRequestFilter
import org.slf4j.LoggerFactory

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userService: UserService
) : OncePerRequestFilter() {

    private val logger = LoggerFactory.getLogger(JwtAuthenticationFilter::class.java)

    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {

        if (request.requestURI == "/login" || request.requestURI == "/") {
            filterChain.doFilter(request, response)
            return
        }

        val jwt = extractJwtFromCookies(request.cookies)
        var jwtExpiredOrInvalid = false

        if (jwt != null) {
            logger.info("JWT Token found in cookie: $jwt")
            val username = jwtService.extractUserEmail(jwt)
            if (username != null && SecurityContextHolder.getContext().authentication == null) {
                logger.info("Username extracted from token: $username")
                val userDetails: UserDetails
                try {
                    userDetails = userService.loadUserByUsername(username)
                } catch (e: UsernameNotFoundException) {
                    logger.error("User not found: $username", e)
                    val cookie = Cookie("jwt", null)
                    cookie.path = "/"
                    cookie.isHttpOnly = true
                    cookie.maxAge = 0 // Immediate expiration
                    response.addCookie(cookie)

                    response.sendRedirect("/login?cleardata=true")
                    filterChain.doFilter(request, response)
                    return
                }
                if (jwtService.validateToken(jwt, userDetails)) {
                    logger.info("JWT Token is valid for user: $username")
                    val newAuthToken = UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.authorities
                    ).apply {
                        details = WebAuthenticationDetailsSource().buildDetails(request)
                    }
                    SecurityContextHolder.getContext().authentication = newAuthToken
                } else {
                    logger.warn("Invalid or expired JWT Token for user: $username")
                    jwtExpiredOrInvalid = true
                }
            } else {
                logger.warn("Username is null or authentication is already set")
            }
        }

        if (jwtExpiredOrInvalid) {
            // Explicitly set a custom header or attribute to indicate the JWT issue
            val cookie = Cookie("jwt", null)
            cookie.path = "/"
            cookie.isHttpOnly = true
            cookie.maxAge = 0 // Immediate expiration
            response.addCookie(cookie)

            response.sendRedirect("/login?cleardata=true")
            return
        }

        filterChain.doFilter(request, response)
    }

    private fun extractJwtFromCookies(cookies: Array<Cookie>?): String? {
        return cookies?.firstOrNull { it.name == "jwt" }?.value
    }
}
