package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.dto.JobTypeDTO;
import com.ppteam.orgstructureserver.service.JobTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Типы работ")
@RestController
@RequestMapping("/api/job-types")
@RequiredArgsConstructor
public class JobTypeController {

    private final JobTypeService jobTypeService;

    @Operation(summary = "Получить список всех типов работ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Все типы работ",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(
                                    schema = @Schema(implementation = JobTypeDTO.class)
                            ))})
    })
    @GetMapping
    public List<JobTypeDTO> findAll() {
        return jobTypeService.findAll();
    }

    @GetMapping(params = "name")
    public List<JobTypeDTO> findJobTypesByNameContaining(@Parameter(description = "Название для поиска")
                                                         @RequestParam(required = false) String name) {
        return jobTypeService.findByNameContainingIgnoreCase(name);
    }

}
