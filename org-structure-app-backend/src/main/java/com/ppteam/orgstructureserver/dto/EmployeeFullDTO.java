package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record EmployeeFullDTO(long id,
                              String fullName,
                              String jobTitle,
                              String jobType,
                              boolean isVacancy,
                              OrganizationalUnitSlimDTO organizationalUnit,
                              List<ProjectDTO> projects) {
}
