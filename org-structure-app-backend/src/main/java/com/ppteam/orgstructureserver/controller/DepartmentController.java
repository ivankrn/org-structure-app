package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.dto.DepartmentWithNestedStructuresDTO;
import com.ppteam.orgstructureserver.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping("/{id}")
    public DepartmentWithNestedStructuresDTO getDepartmentById(@PathVariable long id) {
        return departmentService.findByIdWithNestedStructures(id);
    }

}
