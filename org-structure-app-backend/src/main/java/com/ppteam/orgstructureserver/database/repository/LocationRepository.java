package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Location;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends CrudRepository<Location, Long> {
}
