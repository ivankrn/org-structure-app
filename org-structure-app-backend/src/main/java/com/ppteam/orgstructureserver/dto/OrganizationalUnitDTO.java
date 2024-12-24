package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO организационной единицы")
public record OrganizationalUnitDTO(
        @Schema(description = "ID организационной единицы")
        long id,
        @Schema(description = "Название организационной единицы")
        String name,
        @Schema(description = "Тип организацинной единицы")
        String type,
        @Schema(description = "Локация оранизационной единицы")
        String location,
        @Schema(description = "Глава организационной единицы")
        EmployeeDTO head) {
}
