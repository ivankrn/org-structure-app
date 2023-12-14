package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.OrganizationalUnit;
import com.ppteam.orgstructureserver.dto.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrganizationalUnitMapper {

    @Mapping(source = "organizationalUnit.id", target = "id")
    @Mapping(source = "organizationalUnit.location.name", target = "location")
    OrganizationalUnitDTO convert(OrganizationalUnit organizationalUnit, EmployeeDTO head);

    @Mapping(source = "organizationalUnit.location.name", target = "location")
    OrganizationalUnitSlimDTO convert(OrganizationalUnit organizationalUnit);

    @Mapping(source = "organizationalUnit.id", target = "id")
    @Mapping(source = "organizationalUnit.name", target = "name")
    @Mapping(source = "organizationalUnit.type", target = "type")
    @Mapping(source = "organizationalUnit.location.name", target = "location")
    @Mapping(source = "subsidiaries", target = "subsidiaries")
    OrganizationalUnitWithSubsidiariesDTO convert(OrganizationalUnit organizationalUnit, EmployeeDTO head,
                                                  List<OrganizationalUnitDTO> subsidiaries, List<EmployeeDTO> employees);

    @Mapping(source = "organizationalUnit.id", target = "id")
    @Mapping(source = "organizationalUnit.name", target = "name")
    @Mapping(source = "organizationalUnit.type", target = "type")
    @Mapping(source = "organizationalUnit.location.name", target = "location")
    @Mapping(source = "head", target = "head")
    OrganizationalUnitWithLocationsDTO convert(OrganizationalUnit organizationalUnit, EmployeeDTO head,
                                               List<LocationWithOrganizationalUnitsDTO> locations);

    OrganizationalUnitHierarchyDTO convert(OrganizationalUnit legalEntity, OrganizationalUnit division,
                                           OrganizationalUnit department, OrganizationalUnit group);

}
