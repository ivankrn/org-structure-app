package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.EmployeeFullDTO;

import java.util.List;

public interface EmployeeService {

    EmployeeFullDTO findById(long id);
    List<EmployeeDTO> findByParentId(long parentId);
    List<EmployeeDTO> findByParentIdSortByFullNameAsc(long parentId);
    List<EmployeeDTO> findByFullNameContainingIgnoreCase(String name);
    EmployeeDTO findOrganizationalUnitHead(long organizationalUnitId);

}
