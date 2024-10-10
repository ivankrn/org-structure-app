package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.OrganizationalUnit;
import com.ppteam.orgstructureserver.database.model.OrganizationalUnitType;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizationalUnitRepository extends CrudRepository<OrganizationalUnit, Long>, CustomAggregationStatisticsRepository{


    List<OrganizationalUnit> findByType(OrganizationalUnitType type);

    List<OrganizationalUnit> findByType(OrganizationalUnitType type, Sort sort);

    List<OrganizationalUnit> findByNameContainingIgnoreCase(String name);

    @Query("SELECT DISTINCT unit.name " +
            "FROM OrganizationalUnit unit " +
            "WHERE unit.type = ?1 AND lower(unit.name) LIKE lower(concat('%', ?2,'%'))" +
            "ORDER BY unit.name")
    List<String> findByTypeNamesContaining(OrganizationalUnitType type, String text);

    @Query("SELECT DISTINCT unit.name FROM OrganizationalUnit unit WHERE unit.type = ?1 ORDER BY unit.name")
    List<String> findNamesByType(OrganizationalUnitType type);

    OrganizationalUnitsAggregationRecord calculateOrganizationalUnitsStatistics(List<Long> organizationalUnitsIds);

    List<JobTitlesStatisticsRecord> calculateJobTitleStatistics(List<Long> organizationalUnitsIds);
}
