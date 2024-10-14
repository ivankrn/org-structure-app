package com.ppteam.orgstructureserver.dto;

import java.math.BigDecimal;
import java.util.List;

public record OrganizationalUnitsAggregationInfoDTO(
        int totalPositionsAmount,
        int employeesAmount,
        int vacanciesAmount,
        BigDecimal totalWageFund,
        List<JobTitleStatisticsDTO> jobTitlesStatistics) {
}
