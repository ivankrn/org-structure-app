package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Group;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends CrudRepository<Group, Long> {

    List<Group> findByDivisionId(long divisionId);

    @Query("SELECT g from Group g WHERE g.division.id = ?1 AND g.department.id IS NULL")
    List<Group> findAttachedOnlyToDivisionId(long divisionId);

    @Query("SELECT g from Group g WHERE g.legalEntity.id = ?1 AND g.location.id = ?2 " +
            "AND g.division.id IS NULL AND g.department.id IS NULL")
    List<Group> findNotAttachedByLegalEntityIdAndLocationId(long legalEntityId, long locationId);

    List<Group> findByDepartmentId(long divisionId);

}
