package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.DivisionDTO;
import com.ppteam.orgstructureserver.dto.DivisionWithNestedStructuresDTO;

import java.util.List;

public interface DivisionService {

    List<DivisionDTO> findByLegalEntityIdAndLocationId(long legalEntityId, long locationId);
    DivisionWithNestedStructuresDTO findByIdWithNestedStructures(long id);

}
