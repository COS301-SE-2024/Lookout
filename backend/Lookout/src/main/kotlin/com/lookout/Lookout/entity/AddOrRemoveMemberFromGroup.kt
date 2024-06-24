package com.lookout.Lookout.entity

data class AddOrRemoveMemberFromGroup(
    val groupId: Long,
    val userId: Long
)