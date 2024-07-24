package com.lookout.Lookout.entity

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "images")
data class Image(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    val id: Long? = 0,

    @ManyToOne
    @JoinColumn(name = "userid")//, nullable = false)
    var user: User? = null,

    @ManyToOne
    @JoinColumn(name = "groupid")
    val group: Groups? = null,

    @ManyToOne
    @JoinColumn(name = "categoryid")
    val category: Categories? = null,

    @Column(name = "picture", nullable = false)
    val picture: ByteArray,

    @Column(name = "latitude") //, nullable = false)
    val latitude: Double? = -24.5,

    @Column(name = "longitude") //, nullable = false)
    val longitude: Double? = 32.0,

    @Column(name = "title")
    var title: String? = null,

    @Column(name = "caption")
    var caption: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant? = Instant.now()

)
