package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.LegalEntity;
import com.ppteam.orgstructureserver.dto.LegalEntityWithNestedStructuresDTO;
import com.ppteam.orgstructureserver.dto.LocationWithNestedStructuresDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LegalEntityMapper {

    LegalEntityWithNestedStructuresDTO convert(LegalEntity legalEntity, List<LocationWithNestedStructuresDTO> locations);

}
