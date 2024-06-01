package com.lookout.Lookout.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/")
class UserController {
    @GetMapping("user")
    fun getUser(): ResponseEntity<String>{
        return ResponseEntity.ok("User Login")
    }
}