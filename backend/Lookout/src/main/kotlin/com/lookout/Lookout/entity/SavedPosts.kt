package com.lookout.Lookout.entity

import jakarta.persistence.*

@Entity
@Table(name = "saved_posts")
data class SavedPosts(
    @Id
    @GeneratedValue
    @Column(name = "id")
    var id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "postid")
    var post: Posts? = null,

    @ManyToOne
    @JoinColumn(name = "userid")
    var user: User? = null
)
