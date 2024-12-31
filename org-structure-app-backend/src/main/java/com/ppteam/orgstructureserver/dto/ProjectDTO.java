package com.ppteam.orgstructureserver.dto;


import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Проект")
public record ProjectDTO(
        @Schema(description = "ID")
        long id,
        @Schema(description = "Проект")
        String name) {
}
