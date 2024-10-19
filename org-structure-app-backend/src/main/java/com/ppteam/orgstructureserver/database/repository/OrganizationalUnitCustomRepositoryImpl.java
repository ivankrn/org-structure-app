package com.ppteam.orgstructureserver.database.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

public class OrganizationalUnitCustomRepositoryImpl implements OrganizationalUnitCustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public OrganizationalUnitsAggregationRecord calculateOrganizationalUnitsAggregation(
            List<Long> organizationalUnitsIds) {
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
                """)
                .setParameter("OUIDS", organizationalUnitsIds).getSingleResult();

        return convertRowToOrganizationalUnitsAggregationRecord((Object[])row);
    }

    @Override
    public List<JobTitlesStatisticsRecord> calculateJobTitlesStatistics(List<Long> organizationalUnitsIds) {
        return entityManager.createNativeQuery("""
                 WITH RECURSIVE ou_cte AS (
                     SELECT id
                     FROM organizational_unit
                     WHERE id IN (:OUIDS) OR parent_id IN (:OUIDS)
                     UNION
                     SELECT ou.id
                     FROM organizational_unit ou
                     JOIN ou_cte ON ou_cte.id = ou.parent_id
                 )
                 SELECT jt.id, name,
                    COUNT(CASE WHEN NOT e.is_vacancy THEN 1 ELSE NULL END) amount
                 FROM public.employee e
                 JOIN job_title jt ON e.job_title_id = jt.id
                 WHERE e.is_vacancy = FALSE AND e.parent_id = ANY(ARRAY(SELECT id FROM ou_cte)) 
                 GROUP BY jt.id, jt.name
                 """)
                .setParameter("OUIDS", organizationalUnitsIds)
                .getResultStream()
                .map(row -> convertRowToJobTitleStatisticsRecord((Object[])row))
                .toList();
    }

    private OrganizationalUnitsAggregationRecord convertRowToOrganizationalUnitsAggregationRecord(Object[] row) {
        return new OrganizationalUnitsAggregationRecord(
                ((Long) row[0]).intValue(),
                ((Long) row[1]).intValue(),
                ((Long) row[2]).intValue(),
                row[3] == null ? null : ((BigDecimal) row[3]).setScale(2, RoundingMode.CEILING)
        );
    }

    private JobTitlesStatisticsRecord convertRowToJobTitleStatisticsRecord(Object[] row) {
        return new JobTitlesStatisticsRecord(
                (Long) row[0],
                (String) row[1],
                ((Long) row[2]).intValue()
        );
    }
}
