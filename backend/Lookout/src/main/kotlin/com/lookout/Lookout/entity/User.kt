package com.lookout.Lookout.entity

import com.lookout.Lookout.enums.UserRoles
import jakarta.persistence.*
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails


@Entity
@Table(name="users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_id")
    var id: Long = 0,

    @Column(name = "username")
var firstName: String? = null,

@Column(name = "email")
var email: String? = null,

@Column(name = "password")
var passcode: String? = null,


) : UserDetails {

    override fun getPassword(): String? {
        return passcode
    }

    override fun getUsername(): String? {
        return firstName
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun isEnabled(): Boolean {
        return true
    }
}

