package com.ppteam.orgstructureserver.database.repository;


import java.util.List;

public interface CustomAggregationStatisticsRepository {

    OrganizationalUnitsAggregationRecord calculateOrganizationalUnitsAggregation(List<Long> organizationalUnitsIds);

    List<JobTitlesStatisticsRecord> calculateJobTitlesStatistics(List<Long> organizationalUnitsIds);

    record OrganizationalUnitsAggregationRecord(
            int totalPositionsAmount,
            int employeesAmount,
            int vacanciesAmount,
            long totalWageFund){}

    record JobTitlesStatisticsRecord(
            Long id,
            String name,
            int amount){}
}
