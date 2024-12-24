package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO статистики должности")
public record JobTitleStatisticsDTO(
        @Schema(description = "ID статистики должности")
        Long id,
        @Schema(description = "Должность")
        String name,
        @Schema(description = "Количество позиций с такой должностью")
        int amount) {
}
