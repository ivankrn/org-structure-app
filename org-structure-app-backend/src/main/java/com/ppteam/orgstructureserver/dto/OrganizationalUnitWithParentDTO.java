package com.ppteam.orgstructureserver.dto;

public record OrganizationalUnitWithParentDTO(
        long id,
        String name,
        String type,
        OrganizationalUnitWithParentDTO parent,
        EmployeeDTO head) {
}
