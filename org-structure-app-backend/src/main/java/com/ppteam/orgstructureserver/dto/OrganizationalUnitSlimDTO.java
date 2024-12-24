package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Сокращенная версия DTO организацинной единицы")
public record OrganizationalUnitSlimDTO(
        @Schema(description = "ID организационной единицы")
        long id,
        @Schema(description = "Название организационной единицы")
        String name,
        @Schema(description = "Тип организационной единицы")
        String type,
        @Schema(description = "Локация организационной единицы")
        String location) {
}
