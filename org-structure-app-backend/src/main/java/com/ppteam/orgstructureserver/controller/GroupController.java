package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.dto.GroupWithEmployeesDTO;
import com.ppteam.orgstructureserver.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping("/{id}")
    public GroupWithEmployeesDTO getGroupById(@PathVariable long id) {
        return groupService.findByIdWithEmployees(id);
    }

}
