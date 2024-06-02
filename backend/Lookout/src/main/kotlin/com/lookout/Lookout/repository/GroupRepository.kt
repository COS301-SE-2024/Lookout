package com.lookout.Lookout.repository

import com.lookout.Lookout.entity.Groups
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface GroupRepository : JpaRepository<Groups, Long>