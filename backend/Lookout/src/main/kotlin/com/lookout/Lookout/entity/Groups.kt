package com.lookout.Lookout.entity

import jakarta.persistence.*
import java.util.*
import java.time.Instant

@Entity
@Table(name = "groups")
data class Groups(
    @Id
    @GeneratedValue
    @Column(name = "groupid")
    var id: Long = 0,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "description", nullable = false)
    var description: String,

    @Column(name = "private")
    val isPrivate: Boolean = false,

    @ManyToOne
    @JoinColumn(name = "userid")
    var user: User? = null,

    @Column(name = "picture")
    var picture: String? = "https://animalmicrochips.co.uk/images/default_no_animal.jpg",

    @Column(name = "created_at", updatable = false)
    val createdAt: Instant? = Instant.now(),
)
