package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Проект с сотрудниками, причастных к проекту")
public record ProjectWithEmployeesDTO(
        @Schema(description = "ID")
        long id,
        @Schema(description = "Проект")
        String name,
        @Schema(description = "Список сотрудников, причастных к проекту")
        List<EmployeeDTO> employees) {
}
