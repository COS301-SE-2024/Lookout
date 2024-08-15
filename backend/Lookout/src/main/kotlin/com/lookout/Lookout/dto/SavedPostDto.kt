package com.lookout.Lookout.dto

data class SavedPostDto(
    val savedPostId: Long,
    val postId: Long?,
    val postTitle: String?,
    val postCaption: String?,
    val postLatitude: Double?,
    val postLongitude: Double?,
    val postPicture: String?,
    val postCreatedAt: String?,
    val postCategoryDescription: String?,
    val groupId: Long?,
    val groupName: String?,
    val groupDescription: String?,
    val groupIsPrivate: Boolean?,
    val groupPicture: String?,
    val groupCreatedAt: String?,
    val groupUserId: Long?,
    val groupUsername: String?,
    val groupUserEmail: String?,
    val userId: Long?,
    val username: String?,
    val userEmail: String?
)
