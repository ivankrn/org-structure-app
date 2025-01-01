package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Статистика должности")
public record JobTitleStatisticsDTO(
        @Schema(description = "ID")
        Long id,
        @Schema(description = "Должность")
        String name,
        @Schema(description = "Количество позиций с такой должностью. Не включает в себя вакансии")
        int amount) {
}
