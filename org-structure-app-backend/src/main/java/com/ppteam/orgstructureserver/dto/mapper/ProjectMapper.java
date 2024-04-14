package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.Project;
import com.ppteam.orgstructureserver.dto.ProjectDTO;
import com.ppteam.orgstructureserver.dto.ProjectWithEmployeesDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = EmployeeMapper.class)
public interface ProjectMapper {

    ProjectDTO convert(Project project);
    ProjectWithEmployeesDTO convertToFullDTO(Project project);

}
