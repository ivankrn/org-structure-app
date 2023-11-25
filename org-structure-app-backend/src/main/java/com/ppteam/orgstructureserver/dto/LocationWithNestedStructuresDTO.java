package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record LocationWithNestedStructuresDTO(
        long id,
        String name,
        List<DivisionDTO> divisions,
        List<DepartmentDTO> departments,
        List<GroupDTO> groups) {
}
