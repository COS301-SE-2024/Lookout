package com.lookout.Lookout.dto

data class ProfilePicRequest(
    val userId: Long,
    val image: String?=null,
)
