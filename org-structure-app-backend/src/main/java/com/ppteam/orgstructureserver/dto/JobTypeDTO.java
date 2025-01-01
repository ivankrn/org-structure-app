package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Тип работы")
public record JobTypeDTO(
        @Schema(description = "ID")
        long id,
        @Schema(description = "Тип работы")
        String name) {
}
