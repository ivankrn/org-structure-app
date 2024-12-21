package com.ppteam.orgstructureserver.dto;

import com.ppteam.orgstructureserver.database.model.EmployeeStatus;
import com.ppteam.orgstructureserver.database.model.Gender;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

public record EmployeeFullDTO(long id,
                              String fullName,
                              Gender gender,
                              String jobTitle,
                              String jobType,
                              String email,
                              BigDecimal salary,
                              boolean isVacancy,
                              EmployeeStatus status,
                              ZonedDateTime employmentDate,
                              Integer totalYearsExperience,
                              ZonedDateTime birthdate,
                              String imageUrl,
                              OrganizationalUnitSlimDTO organizationalUnit,
                              List<ProjectDTO> projects) {
}
