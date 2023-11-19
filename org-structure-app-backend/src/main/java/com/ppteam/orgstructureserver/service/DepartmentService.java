package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.DepartmentDTO;
import com.ppteam.orgstructureserver.dto.DepartmentWithNestedStructuresDTO;

import java.util.List;

public interface DepartmentService {

    List<DepartmentDTO> findByDivisionId(long divisionId);
    DepartmentWithNestedStructuresDTO findByIdWithNestedStructures(long id);

}
