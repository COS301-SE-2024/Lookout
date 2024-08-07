package com.lookout.Lookout.entity

data class UpdatePost(
    val id: Long,
    val userid: Long,
    val groupid: Long,
    val categoryid: Int,
    val picture: String,
    val latitude: Double,
    val longitude: Double,
    var caption: String,
    val title: String
)