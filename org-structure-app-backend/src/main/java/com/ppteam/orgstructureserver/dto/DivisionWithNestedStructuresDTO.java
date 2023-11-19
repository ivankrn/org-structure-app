package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record DivisionWithNestedStructuresDTO(
        long id,
        String name,
        EmployeeDTO head,
        List<DepartmentDTO> departments,
        List<GroupDTO> groups,
        List<EmployeeDTO> otherEmployees) {
}
