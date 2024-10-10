package com.ppteam.orgstructureserver.database.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class CustomAggregationStatisticsRepositoryImpl implements CustomAggregationStatisticsRepository{
    @PersistenceContext
    private EntityManager entityManager;
    @Override
    public OrganizationalUnitsAggregationRecord calculateOrganizationalUnitsStatistics(List<Long> organizationalUnitsIds) {
        List<Object[]> organizationalUnitsAggregationObject =  entityManager.createNativeQuery("""
            SELECT
            COUNT(id) total_positions_amount,
            COUNT(CASE WHEN NOT e.is_vacancy THEN 1 ELSE 0 END) employees_amount,
            COUNT(CASE WHEN e.is_vacancy THEN 1 ELSE 0 END) vacancies_amount,
            ((COALESCE(AVG(CASE WHEN NOT e.is_vacancy THEN e.salary ELSE NULL END), 0)) * COUNT(CASE WHEN NOT e.is_vacancy THEN 1 ELSE 0 END) * 12) total_wage_fund
            FROM public.employee e WHERE parent_id IN (:OUIDS)
            """).setParameter("OUIDS", organizationalUnitsIds).getResultList();

        return organizationalUnitsAggregationRecordMapper(organizationalUnitsAggregationObject.get(0));
    }

    @Override
    public List<JobTitlesStatisticsRecord> calculateJobTitleStatistics(List<Long> organizationalUnitsIds) {
        List<Object[]> jobTitleStatisticsObject =  entityManager.createNativeQuery("""
             SELECT jt.id, name,
             COUNT(CASE WHEN NOT e.is_vacancy THEN 1 ELSE NULL END) amount
             FROM public.employee e
             JOIN job_title jt ON e.job_title_id = jt.id
             WHERE parent_id IN (:OUIDS)
             GROUP BY jt.id, jt.name
             """).setParameter("OUIDS", organizationalUnitsIds).getResultList();

        return jobTitleStatisticsRecordMapper(jobTitleStatisticsObject);
    }

    private OrganizationalUnitsAggregationRecord organizationalUnitsAggregationRecordMapper(Object[] result) {
        return new OrganizationalUnitsAggregationRecord(
                ((Long)result[0]).intValue(),
                ((Long)result[1]).intValue(),
                ((Long)result[2]).intValue(),
                ((BigDecimal) result[3]).longValue()
        );
    }

    private List<JobTitlesStatisticsRecord> jobTitleStatisticsRecordMapper(List<Object[]> results) {
        return results.stream()
                .map(result -> new JobTitlesStatisticsRecord(
                        (Long) result[0],
                        (String) result[1],
                        ((Long) result[2]).intValue()
                ))
                .collect(Collectors.toList());
    }
}
