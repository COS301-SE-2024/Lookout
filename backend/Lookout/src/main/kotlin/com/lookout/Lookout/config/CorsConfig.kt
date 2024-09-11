package com.lookout.Lookout.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class CorsConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        // CORS configuration for REST API endpoints
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("Content-Type", "Authorization")
            .allowCredentials(true)

        // CORS configuration for WebSocket endpoints
        registry.addMapping("/ws/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("*")  // WebSocket handshake uses multiple methods
            .allowedHeaders("*")
            .allowCredentials(true)
    }
}