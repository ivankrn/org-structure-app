package com.ppteam.orgstructureserver.dto;


import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO проекта")
public record ProjectDTO(
        @Schema(description = "ID проекта")
        long id,
        @Schema(description = "Название проекта")
        String name) {
}
