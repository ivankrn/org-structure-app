package com.ppteam.orgstructureserver.dto;

import com.ppteam.orgstructureserver.database.model.EmployeeStatus;
import com.ppteam.orgstructureserver.database.model.Gender;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.ZonedDateTime;

@Schema(description = "DTO сотрудника")
public record EmployeeDTO (
        @Schema(description = "ID сотрудника")
        long id,
        @Schema(description = "Полное имя сотрудника")
        String fullName,
        @Schema(description = "Пол сотрудника")
        Gender gender,
        @Schema(description = "Должность сотрудника")
        String jobTitle,
        @Schema(description = "Тип работы сотрудника")
        String jobType,
        @Schema(description = "Электронная почта сотрудника")
        String email,
        @Schema(description = "Является ли позиция вакансией")
        boolean isVacancy,
        @Schema(description = "Статус сотрудника")
        EmployeeStatus status,
        @Schema(description = "Дата трудоустройства")
        ZonedDateTime employmentDate) {
}
