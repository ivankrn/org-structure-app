package com.ppteam.orgstructureserver.database.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class CustomAggregationStatisticsRepositoryImpl implements CustomAggregationStatisticsRepository{
    @PersistenceContext
    private EntityManager entityManager;
    @Override
    public OrganizationalUnitsAggregationRecord calculateOrganizationalUnitsAggregation(List<Long> organizationalUnitsIds) {
        Object row =  entityManager.createNativeQuery("""
                WITH RECURSIVE ou_cte AS (
                    SELECT id
                    FROM organizational_unit
                    WHERE id IN (:OUIDS) OR parent_id IN (:OUIDS)
                    UNION
                    SELECT ou.id
                    FROM organizational_unit ou
                    JOIN ou_cte ON ou_cte.id = ou.parent_id
                ),
                    e_cte AS (
                    SELECT
                        COUNT(CASE WHEN e.is_vacancy THEN 1 ELSE NULL END) vacancy_count,
                        COUNT(CASE WHEN NOT e.is_vacancy THEN 1 ELSE NULL END) employee_count,
                        AVG(CASE WHEN NOT e.is_vacancy THEN e.salary ELSE NULL END) avg_salary
                    FROM employee e
                    WHERE e.parent_id = ANY(ARRAY(SELECT id FROM ou_cte))
                )
                SELECT
                    (e_cte.vacancy_count + e_cte.employee_count) total_job_positions_count,
                    e_cte.vacancy_count vacancy_count,
                    e_cte.employee_count employee_count,
                    (e_cte.avg_salary * e_cte.employee_count * 12) as total_wage_fund
                FROM e_cte;
                """).setParameter("OUIDS", organizationalUnitsIds).getSingleResult();

        return convertRowToorganizationalUnitsAggregationRecord((Object[])row);
    }

    @Transactional(readOnly = true)
    @Override
    public List<JobTitlesStatisticsRecord> calculateJobTitlesStatistics(List<Long> organizationalUnitsIds) {
        return entityManager.createNativeQuery("""
             SELECT jt.id, name,
             COUNT(CASE WHEN NOT e.is_vacancy THEN 1 ELSE NULL END) amount
             FROM public.employee e
             JOIN job_title jt ON e.job_title_id = jt.id
             WHERE parent_id IN (:OUIDS)
             GROUP BY jt.id, jt.name
             """).setParameter("OUIDS", organizationalUnitsIds).getResultStream().map(row -> convertRowToJobTitleStatisticsRecord((Object[])row)).toList();
    }

    private OrganizationalUnitsAggregationRecord convertRowToorganizationalUnitsAggregationRecord(Object[] result) {
        return new OrganizationalUnitsAggregationRecord(
                ((Long)result[0]).intValue(),
                ((Long)result[1]).intValue(),
                ((Long)result[2]).intValue(),
                (BigDecimal) result[3]
        );
    }

    private JobTitlesStatisticsRecord convertRowToJobTitleStatisticsRecord(Object[] result) {
        return new JobTitlesStatisticsRecord(
                        (Long)result[0],
                        (String)result[1],
                        ((Long)result[2]).intValue()
                );
    }
}
