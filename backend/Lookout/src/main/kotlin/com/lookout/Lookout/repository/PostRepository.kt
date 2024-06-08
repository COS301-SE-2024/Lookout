package com.lookout.Lookout.repository

import com.lookout.Lookout.entity.Posts
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PostRepository : JpaRepository<Posts, Int>