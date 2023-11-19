package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record DepartmentWithNestedStructuresDTO(
        long id,
        String name,
        EmployeeDTO head,
        List<GroupDTO> groups,
        List<EmployeeDTO> otherEmployees) {
}
