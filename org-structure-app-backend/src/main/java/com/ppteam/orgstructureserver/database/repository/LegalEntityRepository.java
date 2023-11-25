package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.LegalEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LegalEntityRepository extends CrudRepository<LegalEntity, Long> {
}
