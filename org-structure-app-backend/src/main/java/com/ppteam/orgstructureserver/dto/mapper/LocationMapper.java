package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.Location;
import com.ppteam.orgstructureserver.dto.DepartmentDTO;
import com.ppteam.orgstructureserver.dto.DivisionDTO;
import com.ppteam.orgstructureserver.dto.GroupDTO;
import com.ppteam.orgstructureserver.dto.LocationWithNestedStructuresDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    LocationWithNestedStructuresDTO locationWithNestedStructuresToDTO(Location location, List<DivisionDTO> divisions,
                                                                      List<DepartmentDTO> departments,
                                                                      List<GroupDTO> groups);

}
