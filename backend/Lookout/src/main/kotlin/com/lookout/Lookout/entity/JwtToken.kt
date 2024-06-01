package com.lookout.Lookout.entity

import jakarta.persistence.*

@Entity
@Table(name = "token")
class JwtToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    var id: Int? = null

    @Column(name = "token")
    var token: String? = null

    @Column(name = "is_logged_out")
    var loggedOut: Boolean = false

    @ManyToOne
    @JoinColumn(name = "userid")
    var user: User? = null

    constructor()

    constructor(token: String?, loggedOut: Boolean, user: User?) {
        this.token = token
        this.loggedOut = loggedOut
        this.user = user
    }
}