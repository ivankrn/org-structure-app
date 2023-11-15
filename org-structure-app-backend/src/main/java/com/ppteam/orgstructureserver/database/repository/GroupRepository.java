package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Group;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends CrudRepository<Group, Long> {

    List<Group> findByDivisionId(long divisionId);

}
