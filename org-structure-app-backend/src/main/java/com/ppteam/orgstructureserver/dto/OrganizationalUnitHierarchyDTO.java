package com.ppteam.orgstructureserver.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Иерархия организационной единицы")
public record OrganizationalUnitHierarchyDTO(
        @Schema(description = "Юридическое лицо")
        OrganizationalUnitSlimDTO legalEntity,
        @Schema(description = "Подразделение")
        OrganizationalUnitSlimDTO division,
        @Schema(description = "Отдел")
        OrganizationalUnitSlimDTO department,
        @Schema(description = "Группа")
        OrganizationalUnitSlimDTO group) {
}
