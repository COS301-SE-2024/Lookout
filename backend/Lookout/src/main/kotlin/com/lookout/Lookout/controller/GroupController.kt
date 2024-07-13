package com.lookout.Lookout.controller

import com.lookout.Lookout.dto.GroupDto
import com.lookout.Lookout.entity.AddOrRemoveMemberFromGroup
import com.lookout.Lookout.entity.GroupMembers
import com.lookout.Lookout.entity.Groups
import com.lookout.Lookout.service.GroupService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import com.lookout.Lookout.entity.UpdateGroup

@RestController
@RequestMapping("/api/groups")
class GroupController(private val groupService: GroupService) {

    fun convertToDto(group: Groups): GroupDto {
        return GroupDto(
            id = group.id,
            name = group.name,
            description = group.description,
            isPrivate = group.isPrivate,
            picture = group.picture.toString(),
            createdAt = group.createdAt.toString(),
            userId = group.user?.id ?: 0,
            username = group.user?.username.toString(),
            role = group.user?.role.toString()
        )
    }

    @GetMapping
    fun getAllGroups(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<Page<GroupDto>> {
        val pageable: Pageable = PageRequest.of(page, size)
        val groups = groupService.findAll(pageable).map { group -> convertToDto(group) }
        return ResponseEntity.ok(groups)
    }

    @GetMapping("/{id}")
    fun getGroupById(@PathVariable id: Long): ResponseEntity<GroupDto> {
        val group = groupService.findById(id)
        return if (group != null) {
            ResponseEntity.ok(convertToDto(group))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun createGroup(@RequestBody group: Groups): ResponseEntity<GroupDto> {
        try {
            val savedGroup = groupService.save(group)
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedGroup))
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
    }

    @PutMapping("/{id}")
    fun updateGroup(@PathVariable id: Long, @RequestBody group: Groups): ResponseEntity<GroupDto> {
        val updatedGroup = groupService.findById(id)?.let {
            groupService.save(group.copy(id = it.id))
        }
        return if (updatedGroup != null) {
            ResponseEntity.ok(convertToDto(updatedGroup))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteGroup(@PathVariable id: Long): ResponseEntity<Void> {
        return if (groupService.findById(id) != null) {
            groupService.deleteById(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/user/{userid}")
    fun getGroupsByUserId(@PathVariable userid: Long): ResponseEntity<List<GroupDto>> {
        val groups = groupService.findGroupsByUserId(userid).map { group -> convertToDto(group)}
        return if (groups.isNotEmpty()) {
            ResponseEntity.ok(groups)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @PostMapping("/AddMemberToGroup")
    fun addMemberToGroup(@RequestBody request: AddOrRemoveMemberFromGroup): ResponseEntity<IllegalArgumentException> {
        return try {
            val groupId = request.groupId
            val userId = request.userId
            if (groupId != null && userId != null) {
                groupService.addMember(groupId, userId)
                ResponseEntity.noContent().build()
            } else {
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
            }
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e)
        }
    }

    @PostMapping("/RemoveMemberFromGroup")
    fun RemoveMemberFromGroup(@RequestBody request: AddOrRemoveMemberFromGroup): ResponseEntity<Void> {
        return try {
            val groupId = request.groupId
            val userId = request.userId
            if (groupId != null && userId != null) {
                groupService.removeMember(groupId, userId)
                ResponseEntity.noContent().build()
            } else {
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
            }
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
    }

    @PostMapping("/update")
    fun updateGroup(@RequestBody updateGroup: UpdateGroup): ResponseEntity<Groups> {
        val updatedGroup = groupService.updateGroup(updateGroup)
        return if (updatedGroup != null) {
            ResponseEntity.ok(updatedGroup)
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }
    
}
