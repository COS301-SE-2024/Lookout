package com.lookout.Lookout.entity

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "profilepic")
data class ProfilePic(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    val id: Long? = 0,

    @ManyToOne
    @JoinColumn(name = "userid")//, nullable = false)
    var user: User? = null,

    @Column(name = "picture", nullable = false)
    val picture: ByteArray,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant? = Instant.now()

)
