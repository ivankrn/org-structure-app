package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.Employee;
import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    @Mapping(source = "employee.jobTitle.name", target = "jobTitle")
    @Mapping(source = "employee.jobType.name", target = "jobType")
    EmployeeDTO convert(Employee employee);

}
