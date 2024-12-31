package com.ppteam.orgstructureserver.dto;

import com.ppteam.orgstructureserver.database.model.EmployeeStatus;
import com.ppteam.orgstructureserver.database.model.Gender;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Schema(description = "Полная информация о сотруднике")
public record EmployeeFullDTO(
        @Schema(description = "ID сотрудника")
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
        @Schema(description = "Зарплата")
        BigDecimal salary,
        @Schema(description = "Является ли позиция вакансией")
        boolean isVacancy,
        @Schema(description = "Статус")
        EmployeeStatus status,
        @Schema(description = "Дата трудоустройства")
        ZonedDateTime employmentDate,
        @Schema(description = "Обший стаж работы")
        Integer totalYearsExperience,
        @Schema(description = "День рождения сотрудника")
        ZonedDateTime birthdate,
        @Schema(description = "Ссылка на фото сотрудника")
        String imageUrl,
        @Schema(description = "Организационная единица, в которой находится сотрудник")
        OrganizationalUnitSlimDTO organizationalUnit,
        @Schema(description = "Список проектов, к которым причастен сотрудник")
        List<ProjectDTO> projects) {
}
