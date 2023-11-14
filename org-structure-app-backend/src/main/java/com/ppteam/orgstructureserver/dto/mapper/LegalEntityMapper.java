package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.LegalEntity;
import com.ppteam.orgstructureserver.dto.LegalEntityWithLocationsAndDivisionsDTO;
import com.ppteam.orgstructureserver.dto.LocationWithDivisionsDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LegalEntityMapper {

    LegalEntityWithLocationsAndDivisionsDTO convert(LegalEntity legalEntity, List<LocationWithDivisionsDTO> locations);

}
