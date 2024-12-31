package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Локация")
public record LocationDTO(
        @Schema(description = "ID")
        long id,
        @Schema(description = "Локация")
        String name) {
}
