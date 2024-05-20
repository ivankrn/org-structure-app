package com.ppteam.orgstructureserver.dto;

import java.time.ZonedDateTime;

public record EmployeeDTO (
        long id,
        String fullName,
        String jobTitle,
        String jobType,
        boolean isVacancy,
        ZonedDateTime employmentDate) {
}
