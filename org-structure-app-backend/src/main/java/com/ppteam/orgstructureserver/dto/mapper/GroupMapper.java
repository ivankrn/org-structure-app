package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.Group;
import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.GroupDTO;
import com.ppteam.orgstructureserver.dto.GroupWithEmployeesDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GroupMapper {

    @Mapping(source = "group.id", target = "id")
    GroupDTO convert(Group group, EmployeeDTO head);

    @Mapping(source = "group.id", target = "id")
    GroupWithEmployeesDTO convert(Group group, EmployeeDTO head, List<EmployeeDTO> employees);
}
