package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.DepartmentDTO;
import com.ppteam.orgstructureserver.dto.DepartmentWithNestedStructuresDTO;

import java.util.List;

public interface DepartmentService {

    List<DepartmentDTO> findByDivisionId(long divisionId);
    List<DepartmentDTO> findNotAttachedToDivisionByLegalEntityIdAndLocationId(long legalEntityId, long locationId);
    DepartmentWithNestedStructuresDTO findByIdWithNestedStructures(long id);

}
