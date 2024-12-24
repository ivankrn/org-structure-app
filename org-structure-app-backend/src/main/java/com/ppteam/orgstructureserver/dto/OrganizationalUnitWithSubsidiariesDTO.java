package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "DTO организационной единицы с дочерними организационными единицами")
public record OrganizationalUnitWithSubsidiariesDTO(
        @Schema(description = "ID организационной единицы")
        long id,
        @Schema(description = "Название организационной единицы")
        String name,
        @Schema(description = "Тип организационной единицы")
        String type,
        @Schema(description = "Локация организационной единицы")
        String location,
        @Schema(description = "Общее количество позиций")
        int totalPositionsAmount,
        @Schema(description = "Количество вакансий")
        int vacanciesAmount,
        @Schema(description = "Количество сотрудников")
        int employeesAmount,
        @Schema(description = "Глава организационной единицы")
        EmployeeDTO head,
        @Schema(description = "Заместитель организацинной единицы")
        EmployeeDTO deputy,
        @Schema(description = "Дочерние организационные единицы")
        List<OrganizationalUnitDTO> subsidiaries,
        @Schema(description = "Сотрудники организационной единицы")
        List<EmployeeDTO> employees) {
}
