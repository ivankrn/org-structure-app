package com.ppteam.orgstructureserver.database.repository;

import com.ppteam.orgstructureserver.database.model.OrganizationalUnitType;
import com.ppteam.orgstructureserver.database.model.OrganizationalUnit;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizationalUnitRepository extends CrudRepository<OrganizationalUnit, Long> {

    List<OrganizationalUnit> findByType(OrganizationalUnitType type);
    List<OrganizationalUnit> findByType(OrganizationalUnitType type, Sort sort);

    List<OrganizationalUnit> findByNameContaining(String name);

}
