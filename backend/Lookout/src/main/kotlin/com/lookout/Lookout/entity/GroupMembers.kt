package com.lookout.Lookout.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "groupMembers", schema = "lookout")
data class GroupMembers (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    val id: Int? = null,

    @Column(name = "groupid", nullable = false)
    val groupId: UUID,

    @Column(name = "userid", nullable = false)
    val userId: UUID
)