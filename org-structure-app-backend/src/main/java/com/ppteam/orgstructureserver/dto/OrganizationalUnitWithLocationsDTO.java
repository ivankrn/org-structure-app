package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Организационная единица с группировкой дочерних орг. единиц по локациям")
public record OrganizationalUnitWithLocationsDTO(
        @Schema(description = "ID")
        long id,
        @Schema(description = "Организационная единица")
        String name,
        @Schema(description = "Тип")
        String type,
        @Schema(description = "Локация")
        String location,
        @Schema(description = "Глава")
        EmployeeDTO head,
        @Schema(description = "Локации организационной единицы")
        List<LocationWithOrganizationalUnitsDTO> locations) {
}
