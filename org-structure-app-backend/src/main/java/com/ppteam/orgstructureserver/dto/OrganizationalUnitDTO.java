package com.ppteam.orgstructureserver.dto;

public record OrganizationalUnitDTO(long id, String name, String type, String location, EmployeeDTO head) {
}
