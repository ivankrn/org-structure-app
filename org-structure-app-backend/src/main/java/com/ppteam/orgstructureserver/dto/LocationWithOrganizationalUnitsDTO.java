package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record LocationWithOrganizationalUnitsDTO(String name, List<OrganizationalUnitDTO> structuralUnits) {
}
