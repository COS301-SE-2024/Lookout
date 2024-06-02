package com.lookout.Lookout.entity

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "groupMembers")
data class GroupMembers (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "groupid", nullable = false)
    val group: Groups? = null,

    @ManyToOne
    @JoinColumn(name = "userid")
    var user: User? = null,
)