package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Организационная единица")
public record OrganizationalUnitDTO(
        @Schema(description = "ID")
        long id,
        @Schema(description = "Организационная единица")
        String name,
        @Schema(description = "Тип")
        String type,
        @Schema(description = "Локация")
        String location,
        @Schema(description = "Глава")
        EmployeeDTO head) {
}
