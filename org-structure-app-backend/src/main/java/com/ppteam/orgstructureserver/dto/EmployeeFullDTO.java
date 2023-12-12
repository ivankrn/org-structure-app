package com.ppteam.orgstructureserver.dto;

public record EmployeeFullDTO(long id,
                              String fullName,
                              String jobTitle,
                              String jobType,
                              String location,
                              String division,
                              String department,
                              String group) {
}
