package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Локации с организационными единицами")
public record LocationWithOrganizationalUnitsDTO(
        @Schema(description = "Локация")
        String name,
        @Schema(description = "Дочерние организационные единицы")
        List<OrganizationalUnitDTO> subsidiaries) {
}
