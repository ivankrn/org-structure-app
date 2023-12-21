package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.EmployeeFullDTO;
import com.ppteam.orgstructureserver.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("/{id}")
    public EmployeeFullDTO findEmployeeById(@PathVariable long id) {
        return employeeService.findById(id);
    }

    @GetMapping(params = "name")
    public List<EmployeeDTO> findEmployeesWithFullNameContaining(@RequestParam String name) {
        return employeeService.findByFullNameContainingIgnoreCase(name);
    }

}
