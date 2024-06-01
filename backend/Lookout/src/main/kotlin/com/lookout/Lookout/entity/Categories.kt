package com.lookout.Lookout.entity

import jakarta.persistence.*

@Entity
@Table(name = "categories")
data class Categories(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long = 0,

    @Column(name = "description", nullable = false)
    val description: String
)