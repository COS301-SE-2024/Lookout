package com.lookout.Lookout.dto

data class GroupDto(
    val id: Long,
    val name: String,
    val description: String,
    val isPrivate: Boolean,
    val picture: String,
    val createdAt: String,
    val userId: Long,
    val username: String,
    val role: String
)