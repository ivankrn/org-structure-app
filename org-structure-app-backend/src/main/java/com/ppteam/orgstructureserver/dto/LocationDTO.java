package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO локации")
public record LocationDTO(
        @Schema(description = "ID локации")
        long id,
        @Schema(description = "Название локации")
        String name) {
}
