package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.Department;
import com.ppteam.orgstructureserver.dto.DepartmentDTO;
import com.ppteam.orgstructureserver.dto.DepartmentWithNestedStructuresDTO;
import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.GroupDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    @Mapping(source = "department.id", target = "id")
    DepartmentDTO convert(Department department, EmployeeDTO head);

    @Mapping(source = "department.id", target = "id")
    DepartmentWithNestedStructuresDTO convert(Department department, EmployeeDTO head,
                                              List<GroupDTO> groups, List<EmployeeDTO> otherEmployees);
}
