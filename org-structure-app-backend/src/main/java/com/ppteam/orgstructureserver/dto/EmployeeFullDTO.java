package com.ppteam.orgstructureserver.dto;

import java.time.ZonedDateTime;
import java.util.List;

public record EmployeeFullDTO(long id,
                              String fullName,
                              String jobTitle,
                              String jobType,
                              boolean isVacancy,
                              ZonedDateTime employmentDate,
                              OrganizationalUnitSlimDTO organizationalUnit,
                              List<ProjectDTO> projects) {
}
