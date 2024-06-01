package com.lookout.Lookout.config

import io.github.cdimascio.dotenv.Dotenv
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class EvnConfig {
    @Bean
    fun dotenv(): Dotenv {
        return Dotenv.configure()
            .directory("..\\backend\\Lookout")
            .filename(".env")
            .load()
    }
}