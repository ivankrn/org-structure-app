package com.ppteam.orgstructureserver.dto;

public record OrganizationalUnitHierarchyDTO(
        OrganizationalUnitSlimDTO legalEntity,
        OrganizationalUnitSlimDTO division,
        OrganizationalUnitSlimDTO department,
        OrganizationalUnitSlimDTO group) {
}
