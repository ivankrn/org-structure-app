package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Division;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DivisionRepository extends CrudRepository<Division, Long> {

    List<Division> findByLegalEntityIdAndLocationId(long legalEntityId, long locationId);

}
