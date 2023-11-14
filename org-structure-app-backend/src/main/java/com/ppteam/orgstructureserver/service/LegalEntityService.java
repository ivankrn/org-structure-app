package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.LegalEntityWithLocationsAndDivisionsDTO;

import java.util.List;

public interface LegalEntityService {

    List<LegalEntityWithLocationsAndDivisionsDTO> findAllWithLocationsAndDivisions();

}
