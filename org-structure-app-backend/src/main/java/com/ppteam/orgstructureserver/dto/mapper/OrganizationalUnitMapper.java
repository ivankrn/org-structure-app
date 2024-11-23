package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.OrganizationalUnit;
import com.ppteam.orgstructureserver.dto.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

import static com.ppteam.orgstructureserver.database.repository.OrganizationalUnitCustomRepository.OrganizationalUnitsAggregationRecord;
import static com.ppteam.orgstructureserver.database.repository.OrganizationalUnitCustomRepository.JobTitlesStatisticsRecord;

@Mapper(componentModel = "spring", uses = { EmployeeMapper.class })
public interface OrganizationalUnitMapper {

    @Mapping(source = "organizationalUnit.id", target = "id")
    @Mapping(source = "organizationalUnit.location.name", target = "location")
    OrganizationalUnitDTO convert(OrganizationalUnit organizationalUnit);

    @Mapping(source = "organizationalUnit.location.name", target = "location")
    OrganizationalUnitSlimDTO convertToSlimDTO(OrganizationalUnit organizationalUnit);

    @Mapping(source = "organizationalUnit.id", target = "id")
    @Mapping(source = "organizationalUnit.name", target = "name")
    @Mapping(source = "organizationalUnit.type", target = "type")
    @Mapping(source = "organizationalUnit.location.name", target = "location")
    @Mapping(source = "subsidiaries", target = "subsidiaries")
    OrganizationalUnitWithSubsidiariesDTO convert(OrganizationalUnit organizationalUnit,
                                                  List<OrganizationalUnitDTO> subsidiaries,
                                                  List<EmployeeDTO> employees,
                                                  OrganizationalUnitsAggregationRecord aggregationInfo);

    @Mapping(source = "organizationalUnit.id", target = "id")
    @Mapping(source = "organizationalUnit.name", target = "name")
    @Mapping(source = "organizationalUnit.type", target = "type")
    @Mapping(source = "organizationalUnit.location.name", target = "location")
    OrganizationalUnitWithLocationsDTO convert(OrganizationalUnit organizationalUnit,
                                               List<LocationWithOrganizationalUnitsDTO> locations);

    OrganizationalUnitHierarchyDTO convert(OrganizationalUnit legalEntity, OrganizationalUnit division,
                                           OrganizationalUnit department, OrganizationalUnit group);

    OrganizationalUnitsAggregationInfoDTO convert(OrganizationalUnitsAggregationRecord unitAggregation,
                                                  List<JobTitlesStatisticsRecord> jobTitlesStatistics);
}