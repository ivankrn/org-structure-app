package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.database.model.OrganizationalUnitType;
import com.ppteam.orgstructureserver.dto.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface OrganizationalUnitService {

    OrganizationalUnitWithSubsidiariesDTO findByIdWithSubsidiaries(long id);

    List<OrganizationalUnitDTO> findAllWithFilter(
        OrganizationalUnitType type,
        String name
    );

    List<OrganizationalUnitWithLocationsDTO> findAllWithFilterGroupByProperty(
        OrganizationalUnitType type,
        String name,
        String property
    );

    OrganizationalUnitHierarchyDTO findHierarchyByUnitId(long unitId);

    Map<String, List<String>> findNamesByTypes();

    OrganizationalUnitsAggregationInfoDTO calculateAggregationInfo(Collection<Long> organizationalUnitsIds);
}
