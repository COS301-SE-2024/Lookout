package com.lookout.Lookout.controller

import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller

@Controller
class WebSocketController {
    @MessageMapping("/test") // handles messages sent to /app/test
    @SendTo("/topic/test") // broadcasts result to the /topic/test topic
    fun sendTestMessage(message: String): String {
        return "Server received: $message"
    }
}