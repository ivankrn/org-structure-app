package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.EmployeeFullDTO;
import com.ppteam.orgstructureserver.dto.OrganizationalUnitWithSubsidiariesDTO;
import com.ppteam.orgstructureserver.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Сотрудники")
@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @Operation(summary = "Получить сотрудника по ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Найденный сотрудник",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = OrganizationalUnitWithSubsidiariesDTO.class))}),
            @ApiResponse(responseCode = "404", description = "Если сотрудник не найден",
                    content = @Content),
    })
    @GetMapping("/{id}")
    public EmployeeFullDTO findEmployeeById(@Parameter(description = "ID сотрудника")
                                            @PathVariable long id) {
        return employeeService.findById(id);
    }

    @Operation(summary = "Найти сотрудника по имени")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Найденные сотрудники",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = List.class))})
    })
    @GetMapping(params = "name")
    public List<EmployeeDTO> findEmployeesWithFullNameContaining(@Parameter(description = "Имя для поиска")
                                                                 @RequestParam String name) {
        return employeeService.findByFullNameContainingIgnoreCase(name);
    }

}
