package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.database.model.OrganizationalUnitType;
import com.ppteam.orgstructureserver.dto.OrganizationalUnitDTO;
import com.ppteam.orgstructureserver.dto.OrganizationalUnitHierarchyDTO;
import com.ppteam.orgstructureserver.dto.OrganizationalUnitWithLocationsDTO;
import com.ppteam.orgstructureserver.dto.OrganizationalUnitWithSubsidiariesDTO;

import java.util.List;

public interface OrganizationalUnitService {

    OrganizationalUnitWithSubsidiariesDTO findByIdWithSubsidiaries(long id);

    List<OrganizationalUnitDTO> findAllByType(OrganizationalUnitType type);

    List<OrganizationalUnitDTO> findAllByTypeSortByProperty(OrganizationalUnitType type, String property);

    List<OrganizationalUnitWithLocationsDTO> findAllByTypeGroupByProperty(OrganizationalUnitType type, String property);

    List<OrganizationalUnitDTO> findByNameLike(String name);

    OrganizationalUnitHierarchyDTO findHierarchyByUnitId(long unitId);
}
