package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Организационная единица с дочерними организационными единицами")
public record OrganizationalUnitWithSubsidiariesDTO(
        @Schema(description = "ID")
        long id,
        @Schema(description = "Организационная единица")
        String name,
        @Schema(description = "Тип")
        String type,
        @Schema(description = "Локация")
        String location,
        @Schema(description = "Общее количество позиций")
        int totalPositionsAmount,
        @Schema(description = "Количество вакансий")
        int vacanciesAmount,
        @Schema(description = "Количество сотрудников")
        int employeesAmount,
        @Schema(description = "Глава")
        EmployeeDTO head,
        @Schema(description = "Заместитель")
        EmployeeDTO deputy,
        @Schema(description = "Дочерние организационные единицы")
        List<OrganizationalUnitDTO> subsidiaries,
        @Schema(description = "Непосредственные сотрудники организационной единицы")
        List<EmployeeDTO> employees) {
}
