package com.ppteam.orgstructureserver.database.repository;


import java.util.List;

public interface CustomAggregationStatisticsRepository {

    OrganizationalUnitsAggregationRecord calculateOrganizationalUnitsStatistics(List<Long> organizationalUnitsIds);

    List<JobTitlesStatisticsRecord> calculateJobTitleStatistics(List<Long> organizationalUnitsIds);

    record OrganizationalUnitsAggregationRecord(
            int totalPositionsAmount,
            int employeesAmount,
            int vacanciesAmount,
            long totalWageFund){}

    record JobTitlesStatisticsRecord(
            Long id,
            String name,
            int jobPositionsAmount){}
}
