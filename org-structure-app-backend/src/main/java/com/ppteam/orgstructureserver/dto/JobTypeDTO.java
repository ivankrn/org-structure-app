package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO типа работы")
public record JobTypeDTO(
        @Schema(description = "ID типа работы")
        long id,
        @Schema(description = "Тип работы")
        String name) {
}
