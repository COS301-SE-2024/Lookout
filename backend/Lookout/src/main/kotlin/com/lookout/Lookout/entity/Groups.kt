package com.lookout.Lookout.entity

import jakarta.persistence.*
import java.util.*
import java.time.Instant

@Entity
@Table(name = "groups")
data class Groups(
    @Id
    @GeneratedValue
    @Column(name = "groupid", nullable = false)
    var id: Long = 0,

    @Column(name = "name", nullable = false)
    val name: String,

    @Column(name = "description", nullable = false)
    val description: String,

    @Column(name = "private", nullable = false)
    val isPrivate: Boolean = false,

    @ManyToOne
    @JoinColumn(name = "userid")
    var user: User? = null,

    @Column(name = "picture")
    val picture: String? = "https://animalmicrochips.co.uk/images/default_no_animal.jpg",

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant? = Instant.now()
)
