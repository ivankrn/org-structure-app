package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
}
