package com.lookout.Lookout.controller

import com.lookout.Lookout.dto.CreateGroupDto
import com.lookout.Lookout.dto.GroupDto
import com.lookout.Lookout.dto.UserDto
import com.lookout.Lookout.entity.*
import com.lookout.Lookout.service.GroupService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.MediaType

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

    fun convertToUserDto(user: User): UserDto {
        return UserDto(
            id = user.id,
            userName = user.userName ?: "",
            email = user.email ?: "",
            profilePic = user.profilePic ?: ""
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

    @GetMapping("/all", produces = [MediaType.TEXT_PLAIN_VALUE])
    fun getAllGroupsCsv(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<String> {
        val pageable: Pageable = PageRequest.of(page, size)
        val groupPage = groupService.findAll(pageable)
        val groups = groupPage.content.map { group -> convertToDto(group) }

        // Create CSV content
        val csvBuilder = StringBuilder()
        csvBuilder.append("id,name,description,isPrivate,picture,createdAt,userId\n")
        groups.forEach { dto ->
            csvBuilder.append("${dto.id},${dto.name},${dto.description},${dto.isPrivate},${dto.picture},${dto.createdAt},${dto.userId}\n")
        }

        return ResponseEntity.ok()
            .contentType(MediaType.TEXT_PLAIN)
            .body(csvBuilder.toString())
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
    fun createGroup(@RequestBody createGroupDto: CreateGroupDto): ResponseEntity<GroupDto> {
        try {
            val savedGroup = groupService.savedto(createGroupDto)
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
    fun addMemberToGroup(@RequestBody request: AddOrRemoveMemberFromGroup): ResponseEntity<String> {
        return try {
            val groupId = request.groupId
            val userId = request.userId
            if (groupId != null && userId != null) {
                groupService.addMember(groupId, userId)
                ResponseEntity.noContent().build()
            } else {
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Group ID or User ID is null")
            }
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.message)
        }
    }

    @PostMapping("/RemoveMemberFromGroup")
    fun removeMemberFromGroup(@RequestBody request: AddOrRemoveMemberFromGroup): ResponseEntity<String> {
        return try {
            val groupId = request.groupId
            val userId = request.userId
            if (groupId != null && userId != null) {
                groupService.removeMember(groupId, userId)
                ResponseEntity.noContent().build()
            } else {
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Group ID or User ID is null")
            }
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.message)
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

    @GetMapping("/users/{groupId}")
    fun getGroupMembers(@PathVariable groupId: Long): ResponseEntity<List<UserDto>> {
        val groupMembers = groupService.getGroupMembers(groupId).map { user -> convertToUserDto(user) }
        return if (groupMembers.isNotEmpty()) {
            ResponseEntity.ok(groupMembers)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @GetMapping("/joinedGroups/all", produces = [MediaType.TEXT_PLAIN_VALUE])
    fun getAllGroupMembersCsv(): ResponseEntity<String> {
        return try {
            val groupMembers = groupService.getAllGroupMembers()

            // Create CSV content
            val csvBuilder = StringBuilder()
            csvBuilder.append("id,groupid,userid\n")
            groupMembers.forEachIndexed { index, (groupId, userId) ->
                csvBuilder.append("${index + 1},$groupId,$userId\n")
            }

            ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(csvBuilder.toString())
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)
        }
    }


    
}
