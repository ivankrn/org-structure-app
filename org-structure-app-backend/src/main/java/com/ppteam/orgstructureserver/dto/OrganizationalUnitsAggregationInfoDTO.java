package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record OrganizationalUnitsAggregationInfoDTO(
        int totalPositionsAmount,
        int employeesAmount,
        int vacanciesAmount,
        long totalWageFund,
        List<JobTitleStatisticsDTO> jobTitlesStatistics) {
}
