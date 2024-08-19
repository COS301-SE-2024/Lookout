package com.lookout.Lookout.config

import com.lookout.Lookout.filter.JwtAuthenticationFilter
import com.lookout.Lookout.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfig {
    @Autowired
    lateinit var jwtAuthenticationFilter: JwtAuthenticationFilter
    @Autowired lateinit var userService: UserService

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers(
                        "/api/auth/**", "/login",
                        "/sw.js", "/static/**", "/resources/**",
                        "/webjars/**", "/css/**", "/js/**", "/images/**",
                        "/index.html", "/", "/favicon.ico", "/**/*.html", "/**/*.css", "/**/*.js",
                        "/logo.png", "/manifest.json", "/logo512.png", "/ios/*.png", "/ios/144.png").permitAll() // Permit specific paths
                    .anyRequest().authenticated() // All other paths require authentication
            }
            .sessionManagement { session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    @Throws(Exception::class)
    fun authenticationManager(configuration: AuthenticationConfiguration): AuthenticationManager {
        return configuration.authenticationManager
    }
}

