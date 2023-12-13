package com.ppteam.orgstructureserver.dto;

public record EmployeeFullDTO(long id,
                              String fullName,
                              String jobTitle,
                              String jobType,
                              boolean isVacancy,
                              String location,
                              String division,
                              String department,
                              String group) {
}
