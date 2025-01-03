package com.ppteam.orgstructureserver.database.repository;


import java.math.BigDecimal;
import java.util.List;

public interface OrganizationalUnitCustomRepository {

    OrganizationalUnitsAggregationRecord calculateOrganizationalUnitsAggregation(List<Long> organizationalUnitsIds);

    List<JobTitlesStatisticsRecord> calculateJobTitlesStatistics(List<Long> organizationalUnitsIds);

    record OrganizationalUnitsAggregationRecord(
            int totalPositionsAmount,
            int vacanciesAmount,
            int employeesAmount,
            BigDecimal totalWageFund
    ) {}

    record JobTitlesStatisticsRecord(
            Long id,
            String name,
            int amount
    ) {}
}
