package com.lookout.Lookout.repository
import com.lookout.Lookout.entity.GroupMembers

import com.lookout.Lookout.entity.Groups
import com.lookout.Lookout.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Modifying
import java.util.*

@Repository
interface GroupRepository : JpaRepository<Groups, Long> {
    @Query("SELECT g FROM Groups g JOIN GroupMembers gm ON g.id = gm.group.id WHERE gm.user.id = :userId")
    fun findGroupsByUserId(@Param("userId") userId: Long): List<Groups>
    fun findByUserId(userId: Long, pageable: Pageable): Page<Groups>

    @Query("SELECT COUNT(gm) FROM GroupMembers gm WHERE gm.group.id = :groupId AND gm.user.id = :userId")
    fun countMembersInGroup(@Param("groupId") groupId: Long, @Param("userId") userId: Long): Long

    @Modifying
    @Query("INSERT INTO Group_Members (groupid, userid) VALUES (:groupId, :userId)", nativeQuery = true)
    fun addMemberToGroup(@Param("groupId") groupId: Long, @Param("userId") userId: Long)

    @Modifying
    @Query("DELETE FROM Group_Members WHERE groupid = :groupId AND userid = :userId", nativeQuery = true)
    fun removeMemberFromGroup(@Param("groupId") groupId: Long, @Param("userId") userId: Long)

    @Query("SELECT gm.user FROM GroupMembers gm WHERE gm.group.id = :groupId")
    fun findGroupMembers(@Param("groupId") groupId: Long): List<User>

    @Query("SELECT gm.group.id, gm.user.id FROM GroupMembers gm")
    fun findAllGroupMembers(): List<Array<Any>>

}