package com.lookout.Lookout.dto

data class PostDto (
    val id: Long,
    val caption: String,
    val createdAt: String,
    val userId: Long,
    val username: String,
    val groupId: Long,
    val groupName: String,
    val groupDescription: String,
    val description: String,
    val categoryId: Long,
    val picture: String,
    val latitude: Double,
    val longitude: Double,
)