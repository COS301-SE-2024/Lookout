package com.lookout.Lookout.entity

import jakarta.persistence.*

@Entity
@Table(name = "categories", schema = "lookout")
data class Categories(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    val id: Int? = null,

    @Column(name = "description", nullable = false)
    val description: String
)