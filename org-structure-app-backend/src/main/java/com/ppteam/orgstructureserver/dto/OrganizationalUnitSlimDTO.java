package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Сокращенная информация об организацинной единице")
public record OrganizationalUnitSlimDTO(
        @Schema(description = "ID")
        long id,
        @Schema(description = "Организационная единица")
        String name,
        @Schema(description = "Тип")
        String type,
        @Schema(description = "Локация")
        String location) {
}
