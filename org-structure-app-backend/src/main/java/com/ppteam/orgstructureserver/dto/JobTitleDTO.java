package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO должности")
public record JobTitleDTO(
        @Schema(description = "ID должности")
        long id,
        @Schema(description = "Должность")
        String name) {


}
