package com.lookout.Lookout.repository

import com.lookout.Lookout.entity.Categories
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CategoryRepository : JpaRepository<Categories, Int>