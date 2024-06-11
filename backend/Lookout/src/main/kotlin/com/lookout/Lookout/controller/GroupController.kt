package com.lookout.Lookout.controller

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

    @GetMapping
    fun getAllGroups(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<Page<Groups>> {
        val pageable: Pageable = PageRequest.of(page, size)
        val groups = groupService.findAll(pageable)
        return ResponseEntity.ok(groups)
    }

    @GetMapping("/{id}")
    fun getGroupById(@PathVariable id: Long): ResponseEntity<Groups> {
        val group = groupService.findById(id)
        return if (group != null) {
            ResponseEntity.ok(group)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun createGroup(@RequestBody group: Groups): ResponseEntity<Groups> {
        try {
            val savedGroup = groupService.save(group)
            return ResponseEntity.status(HttpStatus.CREATED).body(savedGroup)
        } catch (e: IllegalArgumentException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
        }
    }

    @PutMapping("/{id}")
    fun updateGroup(@PathVariable id: Long, @RequestBody group: Groups): ResponseEntity<Groups> {
        val updatedGroup = groupService.findById(id)?.let {
            groupService.save(group.copy(id = it.id))
        }
        return if (updatedGroup != null) {
            ResponseEntity.ok(updatedGroup)
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
    fun getGroupsByUserId(@PathVariable userid: Long): ResponseEntity<List<Groups>> {
        val groups = groupService.findGroupsByUserId(userid)
        return if (groups.isNotEmpty()) {
            ResponseEntity.ok(groups)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @PostMapping("/AddMemberToGroup")
    fun addMemberToGroup(@RequestBody request: AddOrRemoveMemberFromGroup): ResponseEntity<Void> {
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
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null)
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
