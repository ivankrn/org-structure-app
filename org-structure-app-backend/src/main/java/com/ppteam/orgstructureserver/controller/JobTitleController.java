package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.dto.JobTitleDTO;
import com.ppteam.orgstructureserver.service.JobTitleService;
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

@Tag(name = "Должности")
@RestController
@RequestMapping("/api/job-titles")
@RequiredArgsConstructor
public class JobTitleController {

    private final JobTitleService jobTitleService;

    @Operation(summary = "Получить список всех должностей")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Все должности",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(
                                    schema = @Schema(implementation = JobTitleDTO.class)
                            ))})
    })
    @GetMapping
    public List<JobTitleDTO> findAll() {
        return jobTitleService.findAll();
    }

    @GetMapping(params = "name")
    public List<JobTitleDTO> findJobTitlesByNameContaining(@Parameter(description = "Название для поиска")
                                                           @RequestParam(required = false) String name) {
        return jobTitleService.findByNameContainingIgnoreCase(name);
    }

}
