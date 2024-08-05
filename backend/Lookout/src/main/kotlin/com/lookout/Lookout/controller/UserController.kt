package com.lookout.Lookout.controller

import org.springframework.http.ResponseEntity
import com.lookout.Lookout.dto.UserDto
import com.lookout.Lookout.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/")
class UserController(private val userService: UserService) {
    @GetMapping("user")
    fun getUser(): ResponseEntity<String>{
        return ResponseEntity.ok("User Login")
    }


    @GetMapping("api/user/postsCount/{id}")
    fun getUserPostsCount(@PathVariable id: Long): ResponseEntity<Int> {
        try {
            userService.findById(id)
        } catch (e: NoSuchElementException) {
            return ResponseEntity.notFound().build()
        }
        val postsCount = userService.getUserPostsCount(id)
        return ResponseEntity.ok(postsCount)
    }

    @GetMapping("api/user/groupsCount/{id}")
    fun getUserGroupsCount(@PathVariable id: Long): ResponseEntity<Int> {
        try {
            userService.findById(id)
        } catch (e: NoSuchElementException) {
            return ResponseEntity.notFound().build()
        }
        val groupsCount = userService.getUserGroupsCount(id)
        return ResponseEntity.ok(groupsCount)
    }
}