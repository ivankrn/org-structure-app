package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record OrganizationalUnitWithLocationsDTO(
        long id,
        String name,
        String type,
        String location,
        EmployeeDTO head,
        List<LocationWithOrganizationalUnitsDTO> locations) {
}
