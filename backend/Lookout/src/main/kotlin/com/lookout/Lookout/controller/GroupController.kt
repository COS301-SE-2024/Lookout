package com.lookout.Lookout.controller

import com.lookout.Lookout.dto.CreateGroupDto
import com.lookout.Lookout.dto.GroupDto
import com.lookout.Lookout.dto.UserDto
import com.lookout.Lookout.entity.*
import com.lookout.Lookout.service.GroupService
import com.lookout.Lookout.service.JwtService
import com.lookout.Lookout.service.UserService
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.MediaType

@RestController
@RequestMapping("/api/groups")
class GroupController(
    private val groupService: GroupService,
    private val jwtService: JwtService,
    private val userService: UserService
) {

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
    fun getAllGroupsCsv(): ResponseEntity<String> {
        val groups = groupService.findAll()  // Assuming findAll() returns all groups without pagination.
            .map { group -> convertToDto(group) }

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

    @GetMapping("/owner/{ownerId}")
    fun getGroupsByOwnerId(@PathVariable ownerId: Long): ResponseEntity<List<GroupDto>> {
        val groups = groupService.findGroupsByOwnerId(ownerId).map { group -> convertToDto(group) }
        return if (groups.isNotEmpty()) {
            ResponseEntity.ok(groups)
        } else {
            ResponseEntity.noContent().build()
        }
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
    fun createGroup(@RequestBody createGroupDto: CreateGroupDto,request: HttpServletRequest): ResponseEntity<GroupDto> {
        try {
            var userId: Long = 0
            val jwt = extractJwtFromCookies(request.cookies)

            val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

            val user = userEmail?.let { userService.loadUserByUsername(it) }

            if (user is User) {
                println("User ID: ${user.id}")
                userId = user.id
            }
            val savedGroup = groupService.savedto(createGroupDto, userId)
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

    @GetMapping("/user")
    fun getGroupsByUserId(request: HttpServletRequest): ResponseEntity<List<GroupDto>> {
        var userId: Long = 0
        val jwt = extractJwtFromCookies(request.cookies)

        val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

        val user = userEmail?.let { userService.loadUserByUsername(it) }

        if (user is User) {
            println("User ID: ${user.id}")
            userId = user.id
        }
        val groups = groupService.findGroupsByUserId(userId).map { group -> convertToDto(group)}
        return if (groups.isNotEmpty()) {
            ResponseEntity.ok(groups)
        } else {
            ResponseEntity.noContent().build()
        }
    }

    @GetMapping("/user/createdBy")
    fun getGroupsByUserCreate(request: HttpServletRequest): ResponseEntity<List<GroupDto>> {
        var userId: Long = 0
        val jwt = extractJwtFromCookies(request.cookies)

        val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

        val user = userEmail?.let { userService.loadUserByUsername(it) }

        if (user is User) {
            println("User ID: ${user.id}")
            userId = user.id
        }
        val groups = groupService.findGroupsByOwnerId(userId).map { group -> convertToDto(group)}
        return ResponseEntity.ok(groups)
    }

    @PostMapping("/AddMemberToGroup")
    fun addMemberToGroup(@RequestBody request: AddOrRemoveMemberFromGroup,
                         requestid: HttpServletRequest): ResponseEntity<String> {
        return try {
            var userId: Long = 0
            val jwt = extractJwtFromCookies(requestid.cookies)

            val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

            val user = userEmail?.let { userService.loadUserByUsername(it) }

            if (user is User) {
                println("User ID: ${user.id}")
                userId = user.id
            }
            val groupId = request.groupId
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
    fun removeMemberFromGroup(@RequestBody request: AddOrRemoveMemberFromGroup,
                              requestid: HttpServletRequest): ResponseEntity<String> {
        return try {
            var userId: Long = 0
            val jwt = extractJwtFromCookies(requestid.cookies)

            val userEmail = jwt?.let { jwtService.extractUserEmail(it) }

            val user = userEmail?.let { userService.loadUserByUsername(it) }

            if (user is User) {
                println("User ID: ${user.id}")
                userId = user.id
            }
            val groupId = request.groupId

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
        return try {
            val groupMembers = groupService.getGroupMembers(groupId).map { user -> convertToUserDto(user) }
            if (groupMembers.isNotEmpty()) {
                ResponseEntity.ok(groupMembers)
            } else {
                ResponseEntity.noContent().build()
            }
        } catch (e: IllegalArgumentException) {
            ResponseEntity.notFound().build() // Return 404 if group not found
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

    // Helper method to extract JWT from request cookies
    private fun extractJwtFromCookies(cookies: Array<Cookie>?): String? {
        return cookies?.firstOrNull { it.name == "jwt" }?.value
    }
    
}
