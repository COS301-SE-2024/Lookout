package com.lookout.Lookout.repository
import com.lookout.Lookout.entity.GroupMembers

import com.lookout.Lookout.entity.Groups
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import java.util.*

@Repository
interface GroupRepository : JpaRepository<Groups, Long> {
    @Query("SELECT g FROM Groups g JOIN GroupMembers gm ON g.id = gm.group.id WHERE gm.user.id = :userId")
    fun findGroupsByUserId(@Param("userId") userId: Long): List<Groups>
    fun findByUserId(userId: Long, pageable: Pageable): Page<Groups>
}