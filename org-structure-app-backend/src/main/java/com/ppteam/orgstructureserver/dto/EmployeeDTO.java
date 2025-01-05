package com.ppteam.orgstructureserver.dto;

import com.ppteam.orgstructureserver.database.model.EmployeeStatus;
import com.ppteam.orgstructureserver.database.model.Gender;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Schema(description = "Сотрудник")
public record EmployeeDTO (
        @Schema(description = "ID")
        long id,
        @Schema(description = "ФИО")
        String fullName,
        @Schema(description = "Пол")
        Gender gender,
        @Schema(description = "Должность")
        String jobTitle,
        @Schema(description = "Тип работы")
        String jobType,
        @Schema(description = "Электронная почта")
        String email,
        @Schema(description = "Зарплата (в рублях)")
        BigDecimal salary,
        @Schema(description = "Является ли позиция вакансией")
        boolean isVacancy,
        @Schema(description = "Статус")
        EmployeeStatus status,
        @Schema(description = "Дата трудоустройства")
        ZonedDateTime employmentDate,
        @Schema(description = "Обший стаж работы")
        Integer totalYearsExperience,
        @Schema(description = "Ссылка на фото сотрудника")
        String imageUrl
) { }
