package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.dto.ProjectDTO;
import com.ppteam.orgstructureserver.dto.ProjectWithEmployeesDTO;
import com.ppteam.orgstructureserver.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Проекты")
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @Operation(summary = "Получить проект по ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Найденный проект",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProjectWithEmployeesDTO.class))}),
            @ApiResponse(responseCode = "404", description = "Если проект не найден",
                    content = @Content),
    })
    @GetMapping("/{id}")
    public ProjectWithEmployeesDTO findProjectById(@Parameter(description = "ID проекта")
                                                   @PathVariable long id) {
        return projectService.findById(id);
    }

    @Operation(summary = "Найти проекты по имени")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Найденные проекты",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(
                                    schema = @Schema(implementation = ProjectDTO.class)
                            ))})
    })
    @GetMapping(params = "name")
    public List<ProjectDTO> findProjectsWithNameContaining(@Parameter(description = "Имя для поиска")
                                                           @RequestParam String name) {
        return projectService.findByNameContainingIgnoreCase(name);
    }

}
