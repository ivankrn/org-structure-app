package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.database.model.OrganizationalUnitType;
import com.ppteam.orgstructureserver.dto.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface OrganizationalUnitService {

    OrganizationalUnitWithSubsidiariesDTO findByIdWithSubsidiaries(long id);

    List<OrganizationalUnitDTO> findAllByType(OrganizationalUnitType type);

    List<OrganizationalUnitWithLocationsDTO> findAllByTypeGroupByProperty(OrganizationalUnitType type, String property);

    List<OrganizationalUnitDTO> findByNameContainingIgnoreCase(String name);

    OrganizationalUnitHierarchyDTO findHierarchyByUnitId(long unitId);
    Map<String, List<String>> findNamesByTypes();

    OrganizationalUnitsAggregationInfoDTO calculateAggregationInfo(Collection<Long> organizationalUnitsIds);
}
