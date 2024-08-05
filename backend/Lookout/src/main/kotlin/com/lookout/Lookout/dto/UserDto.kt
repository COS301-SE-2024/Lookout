package com.lookout.Lookout.dto

data class UserDto (
    val id: Long,
    val userName: String,
    val email: String,
    val role: String,
    val isEnabled: Boolean,
    val username: String,
    val authorities: List<String>,
    val isAccountNonLocked: Boolean,
    val isCredentialsNonExpired: Boolean,
    val isAccountNonExpired: Boolean
)