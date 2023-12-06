package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.EmployeeDTO;

import java.util.List;

public interface EmployeeService {

    List<EmployeeDTO> findByParentId(long parentId);
    List<EmployeeDTO> findByParentIdSortByFullNameAsc(long parentId);
    List<EmployeeDTO> findByFullNameContaining(String name);
    EmployeeDTO findOrganizationalUnitHead(long organizationalUnitId);

}
