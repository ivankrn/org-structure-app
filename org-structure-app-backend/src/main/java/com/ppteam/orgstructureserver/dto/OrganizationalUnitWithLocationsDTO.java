package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "DTO организационной единицы с локациями")
public record OrganizationalUnitWithLocationsDTO(
        @Schema(description = "ID организационной единицы")
        long id,
        @Schema(description = "Название организационной единицы")
        String name,
        @Schema(description = "Тип организационной единицы")
        String type,
        @Schema(description = "Локация организационной единицы")
        String location,
        @Schema(description = "Глава организационной единицы")
        EmployeeDTO head,
        @Schema(description = "Локации организационной единицы")
        List<LocationWithOrganizationalUnitsDTO> locations) {
}
