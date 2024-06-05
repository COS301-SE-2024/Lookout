package com.lookout.Lookout.service

import com.lookout.Lookout.entity.Groups
import com.lookout.Lookout.repository.GroupRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

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
}
