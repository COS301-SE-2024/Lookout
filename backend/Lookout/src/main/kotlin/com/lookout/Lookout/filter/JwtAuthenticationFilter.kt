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

        if (request.requestURI == "/login") {
            filterChain.doFilter(request, response)
            return
        }

        val jwt = extractJwtFromCookies(request.cookies)
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
                    logger.warn("Invalid JWT Token for user: $username")
//                    redirectToLogin(response)
//                    return
                }
            } else {
                logger.warn("Username is null or authentication is already set")
            }
        } else {
            logger.warn("No JWT Token found in cookies")
        }
        filterChain.doFilter(request, response)
    }

    private fun extractJwtFromCookies(cookies: Array<Cookie>?): String? {
        return cookies?.firstOrNull { it.name == "jwt" }?.value
    }

    private fun redirectToLogin(response: HttpServletResponse) {
        // Check if the request is for an actual page rather than a resource
        val requestUri = response.encodeRedirectURL(response.toString())
        if (!requestUri.endsWith(".js") && !requestUri.endsWith(".css") && !requestUri.endsWith(".json")) {
            response.sendRedirect("/login")
        } else {
            response.status = HttpServletResponse.SC_UNAUTHORIZED
        }
    }

}




