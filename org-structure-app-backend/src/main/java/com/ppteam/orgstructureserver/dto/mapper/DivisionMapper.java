package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.Division;
import com.ppteam.orgstructureserver.dto.*;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DivisionMapper {

    DivisionDTO convert(Division division);
    DivisionWithNestedStructuresDTO convert(Division division, List<DepartmentDTO> departments,
                                            List<GroupDTO> groups, List<EmployeeDTO> otherEmployees);

}
