package com.lookout.Lookout.dto

import com.lookout.Lookout.entity.Categories

data class ImageRequest(
    val caption: String?= null,
    val title: String?= null,
    val categoryId: Int,
    val groupId: Long,
    val userId: Long,
    val image: String?=null,
    val latitude: Double?=null,
    val longitude: Double?=null,
)
