package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.util.List;

@Schema(description = "Агрегация организационных единиц")
public record OrganizationalUnitsAggregationInfoDTO(
        @Schema(description = "Общее количество позиций")
        int totalPositionsAmount,
        @Schema(description = "Количество сотрудников")
        int employeesAmount,
        @Schema(description = "Количество вакансий")
        int vacanciesAmount,
        @Schema(description = "Общий ФОТ")
        BigDecimal totalWageFund,
        @Schema(description = "Список статистики по должностям")
        List<JobTitleStatisticsDTO> jobTitlesStatistics) {
}
