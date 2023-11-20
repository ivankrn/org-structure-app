package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.LegalEntityWithNestedStructuresDTO;

import java.util.List;

public interface LegalEntityService {

    List<LegalEntityWithNestedStructuresDTO> findAllWithLocationsAndDivisions();

}
