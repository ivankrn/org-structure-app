package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.Department;
import com.ppteam.orgstructureserver.dto.DepartmentDTO;
import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    @Mapping(source = "department.id", target = "id")
    DepartmentDTO convert(Department department, EmployeeDTO head);

}
