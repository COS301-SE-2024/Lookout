package com.lookout.Lookout.entity

data class CreatePost(
    val userid: Long,
    val groupid: Long,
    val categoryid: Int,
    val picture: String,
    val latitude: Double,
    val longitude: Double,
    val caption: String,
    val title: String,
)