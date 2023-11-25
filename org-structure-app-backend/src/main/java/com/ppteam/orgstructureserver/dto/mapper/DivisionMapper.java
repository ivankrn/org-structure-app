package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.Division;
import com.ppteam.orgstructureserver.dto.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DivisionMapper {
    @Mapping(source = "division.id", target = "id")

    DivisionDTO convert(Division division, EmployeeDTO head);

    @Mapping(source = "division.id", target = "id")
    DivisionWithNestedStructuresDTO convert(Division division, EmployeeDTO head, List<DepartmentDTO> departments,
                                            List<GroupDTO> groups, List<EmployeeDTO> otherEmployees);

}
