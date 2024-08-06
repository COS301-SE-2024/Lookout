package com.lookout.Lookout.dto

data class UserDto (
    var id: Long,
    var userName: String?,
    var email: String?,
    var profilePic: String? = null
)
