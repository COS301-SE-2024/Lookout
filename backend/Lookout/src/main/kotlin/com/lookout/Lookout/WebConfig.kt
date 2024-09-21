package com.lookout.Lookout

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addViewControllers(registry: ViewControllerRegistry) {
        registry.addViewController("/{spring:[a-zA-Z\\-]+}")
            .setViewName("forward:/index.html")
        registry.addViewController("/**/{spring:[a-zA-Z\\-]+}")
            .setViewName("forward:/index.html")
        registry.addViewController("/{spring:[a-zA-Z\\-]+}/**{spring:[^\\.]*}")
            .setViewName("forward:/index.html")
    }
}

