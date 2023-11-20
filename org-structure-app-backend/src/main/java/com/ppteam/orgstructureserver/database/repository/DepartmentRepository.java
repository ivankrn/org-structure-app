package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Department;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends CrudRepository<Department, Long> {

    List<Department> findByDivisionId(long divisionId);

    @Query("SELECT d from Department d WHERE d.legalEntity.id = ?1 AND d.location.id = ?2 AND d.division.id IS NULL")
    List<Department> findNotAttachedToDivisionByLegalEntityIdAndLocationId(long legalEntityId, long locationId);

}
