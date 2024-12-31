package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Должность")
public record JobTitleDTO(
        @Schema(description = "ID")
        long id,
        @Schema(description = "Должность")
        String name) {


}
