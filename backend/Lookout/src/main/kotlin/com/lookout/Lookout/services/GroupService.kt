package com.lookout.Lookout.service

import com.lookout.Lookout.entity.Groups
import com.lookout.Lookout.repository.GroupRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class GroupService(private val groupRepository: GroupRepository) {

    fun findAll(): List<Groups> = groupRepository.findAll()

    fun findById(groupId: Long): Groups? = groupRepository.findById(groupId).orElse(null)

    fun save(group: Groups): Groups = groupRepository.save(group)

    fun deleteById(groupId: Long) = groupRepository.deleteById(groupId)

    fun findGroupsByUserId(userid: Long): List<Groups> = groupRepository.findGroupsByUserId(userid)
}