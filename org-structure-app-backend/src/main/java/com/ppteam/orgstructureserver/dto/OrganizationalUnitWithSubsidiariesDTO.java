package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record OrganizationalUnitWithSubsidiariesDTO(
        long id,
        String name,
        String type,
        String location,
        int totalPositionsAmount,
        int vacanciesAmount,
        int employeesAmount,
        EmployeeDTO head,
        EmployeeDTO deputy,
        List<OrganizationalUnitDTO> subsidiaries,
        List<EmployeeDTO> employees) {
}
