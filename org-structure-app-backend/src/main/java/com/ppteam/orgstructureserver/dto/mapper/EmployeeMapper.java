package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.Employee;
import com.ppteam.orgstructureserver.database.model.OrganizationalUnit;
import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.EmployeeFullDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    @Mapping(source = "employee.jobTitle.name", target = "jobTitle")
    @Mapping(source = "employee.jobType.name", target = "jobType")
    @Mapping(source = "employee.vacancy", target = "isVacancy")
    EmployeeDTO convertToDTO(Employee employee);

    @Mapping(source = "employee.id", target = "id")
    @Mapping(source = "employee.jobTitle.name", target = "jobTitle")
    @Mapping(source = "employee.jobType.name", target = "jobType")
    @Mapping(source = "employee.vacancy", target = "isVacancy")
    @Mapping(source = "employee.parent.location.name", target = "location")
    @Mapping(source = "division.name", target = "division")
    @Mapping(source = "department.name", target = "department")
    @Mapping(source = "group.name", target = "group")
    EmployeeFullDTO convertToFullDTO(Employee employee, OrganizationalUnit division, OrganizationalUnit department,
                                     OrganizationalUnit group);
}
