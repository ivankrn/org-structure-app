package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.EmployeeDTO;

import java.util.List;

public interface EmployeeService {

    List<EmployeeDTO> findAttachedOnlyToDivisionId(long divisionId);
    List<EmployeeDTO> findAttachedOnlyToDepartmentId(long departmentId);
    EmployeeDTO findDivisionHead(long divisionId);
    EmployeeDTO findDepartmentHead(long departmentId);
    EmployeeDTO findGroupHead(long groupId);

}
