package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.LocationWithDivisionsDTO;

import java.util.List;

public interface LocationService {

    List<LocationWithDivisionsDTO> findAllWithDivisionsByLegalEntityId(long legalEntityId);

}
