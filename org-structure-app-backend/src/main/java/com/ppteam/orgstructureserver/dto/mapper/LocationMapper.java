package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.Division;
import com.ppteam.orgstructureserver.database.model.Location;
import com.ppteam.orgstructureserver.dto.LocationWithDivisionsDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    LocationWithDivisionsDTO locationWithDivisionsToDTO(Location location, List<Division> divisions);

}
