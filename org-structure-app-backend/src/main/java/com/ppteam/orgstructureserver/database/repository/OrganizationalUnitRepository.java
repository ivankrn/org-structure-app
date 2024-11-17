package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.OrganizationalUnit;
import com.ppteam.orgstructureserver.database.model.OrganizationalUnitType;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizationalUnitRepository extends CrudRepository<OrganizationalUnit, Long>,
        OrganizationalUnitCustomRepository {

    @Query(
    """
    SELECT ou FROM OrganizationalUnit ou
    WHERE (ou.type = :type OR (:type) IS NULL)
        AND (LOWER(ou.name) LIKE CONCAT('%', LOWER(:name), '%') OR (:name) IS NULL)
    ORDER BY ou.name
    """
    )
    List<OrganizationalUnit> findByTypeAndNameContainingIgnoreCase(OrganizationalUnitType type, String name);

    @Query("SELECT DISTINCT unit.name FROM OrganizationalUnit unit WHERE unit.type = ?1 ORDER BY unit.name")
    List<String> findNamesByType(OrganizationalUnitType type);

    OrganizationalUnitsAggregationRecord calculateOrganizationalUnitsAggregation(List<Long> organizationalUnitsIds);

    List<JobTitlesStatisticsRecord> calculateJobTitlesStatistics(List<Long> organizationalUnitsIds);
}
