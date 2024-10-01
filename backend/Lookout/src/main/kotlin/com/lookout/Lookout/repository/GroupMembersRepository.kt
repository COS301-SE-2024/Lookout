package com.lookout.Lookout.repository

import com.lookout.Lookout.entity.GroupMembers
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface GroupMembersRepository : JpaRepository<GroupMembers, Long> {

    @Modifying
    @Query("DELETE FROM GroupMembers gm WHERE gm.group.id = :groupId")
    fun deleteByGroupId(@Param("groupId") groupId: Long)
}