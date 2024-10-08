package com.lookout.Lookout.entity

import jakarta.persistence.*
import java.util.*
import java.time.Instant

@Entity
@Table(name = "posts")
data class Posts(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    val id: Long? = null,

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    var user: User? = null,

    @ManyToOne
    @JoinColumn(name = "groupid")
    val group: Groups? = null,

    @ManyToOne
    @JoinColumn(name = "categoryid")
    val category: Categories? = null,

    @Column(name = "picture", nullable = false)
    val picture: String,

    @Column(name = "latitude", nullable = false)
    val latitude: Double,

    @Column(name = "longitude", nullable = false)
    val longitude: Double,

    @Column(name = "title")
    var title: String? = null,

    @Column(name = "caption")
    var caption: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant? = Instant.now(),

//    @Column(name = "location", nullable = true)
//    val location: String,
)
