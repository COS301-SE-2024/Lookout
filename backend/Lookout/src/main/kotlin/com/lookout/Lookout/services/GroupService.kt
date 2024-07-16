package com.lookout.Lookout.service

import com.lookout.Lookout.dto.GroupDto
import com.lookout.Lookout.entity.Groups
import com.lookout.Lookout.repository.GroupRepository
import com.lookout.Lookout.entity.UpdateGroup
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class GroupService(private val groupRepository: GroupRepository, private val userService: UserService) {

    fun findAll(pageable: Pageable): Page<Groups> = groupRepository.findAll(pageable)

    fun findById(groupId: Long): Groups? = groupRepository.findById(groupId).orElse(null)

    fun save(group: Groups): Groups {
        // Ensure user exists before saving the group
        group.user?.let { user ->
            userService.findById(user.id).ifPresent {
                group.user = it
            } ?: throw IllegalArgumentException("User not found with id: ${user.id}")
        }
        return groupRepository.save(group)
    }

    fun deleteById(groupId: Long) = groupRepository.deleteById(groupId)

    fun findGroupsByUserId(userid: Long): List<Groups> = groupRepository.findGroupsByUserId(userid)


    @Transactional
    fun addMember(groupId: Long, userId: Long) {
        val group = findById(groupId) ?: throw IllegalArgumentException("Group not found with id: $groupId")
        val user = userService.findById(userId).orElseThrow { IllegalArgumentException("User not found with id: $userId") }

        if (groupRepository.countMembersInGroup(group.id, user.id) > 0) {
            throw IllegalArgumentException("User is already in the group")
        }

        groupRepository.addMemberToGroup(group.id, user.id)
    }

    @Transactional
    fun removeMember(groupId: Long, userId: Long) {
        val group = findById(groupId) ?: throw IllegalArgumentException("Group not found with id: $groupId")
        val user = userService.findById(userId).orElseThrow { IllegalArgumentException("User not found with id: $userId") }

        if (groupRepository.countMembersInGroup(group.id, user.id).toInt() == 0) {
            throw IllegalArgumentException("User is not in the group")
        }

        groupRepository.removeMemberFromGroup(group.id, user.id)
    }

    fun updateGroup(updateGroup: UpdateGroup): Groups? {
        val groupOptional: Optional<Groups> = groupRepository.findById(updateGroup.id)
        if (groupOptional.isPresent) {
            val group = groupOptional.get()

            updateGroup.name?.let { group.name = it }
            updateGroup.description?.let { group.description = it }
            updateGroup.picture?.let { group.picture = it }

            return groupRepository.save(group)
        }
        return null
    }

}
