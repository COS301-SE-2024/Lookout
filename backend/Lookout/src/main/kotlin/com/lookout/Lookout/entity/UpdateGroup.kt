package com.lookout.Lookout.entity

data class UpdateGroup(
    val id: Long,
    var name: String? = null,
    var description: String? = null,
    var picture: String? = null
)