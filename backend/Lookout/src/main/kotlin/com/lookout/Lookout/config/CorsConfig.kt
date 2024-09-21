package com.lookout.Lookout.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class CorsConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {

        registry.addMapping("/**")
            .allowedOrigins("**")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("Content-Type", "Authorization")
            .allowCredentials(true)

        registry.addMapping("/ws/**")
            .allowedOrigins("http://localhost:3000", "http://localhost:8080")
            .allowedMethods("*")
            .allowedHeaders("*")
            .allowCredentials(true)

    }
}