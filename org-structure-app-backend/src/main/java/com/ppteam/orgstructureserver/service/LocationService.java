package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.LocationWithNestedStructuresDTO;

import java.util.List;

public interface LocationService {

    List<LocationWithNestedStructuresDTO> findAllWithNestedStructuresByLegalEntityId(long legalEntityId);

}
