package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping(params = "name")
    public List<EmployeeDTO> findEmployeesWithFullNameContaining(@RequestParam String name) {
        return employeeService.findByFullNameContaining(name);
    }

}
