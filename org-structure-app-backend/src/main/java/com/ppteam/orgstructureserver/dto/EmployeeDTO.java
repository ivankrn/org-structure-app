package com.ppteam.orgstructureserver.dto;

import com.ppteam.orgstructureserver.database.model.EmployeeStatus;
import com.ppteam.orgstructureserver.database.model.Gender;

import java.time.ZonedDateTime;

public record EmployeeDTO (
        long id,
        String fullName,
        Gender gender,
        String jobTitle,
        String jobType,
        String email,
        boolean isVacancy,
        EmployeeStatus status,
        ZonedDateTime employmentDate) {
}
