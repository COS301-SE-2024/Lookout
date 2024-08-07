package com.lookout.Lookout.dto

data class CreateGroupDto(
    val name: String,
    val description: String,
    val picture: String,
    val isPrivate: Boolean? = false,
    val userId: Long
)
