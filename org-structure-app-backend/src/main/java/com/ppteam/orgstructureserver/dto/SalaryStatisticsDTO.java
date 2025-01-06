package com.ppteam.orgstructureserver.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Статистика зарплат")
public record SalaryStatisticsDTO(
    @Schema(description = "Минимальная зарплата")
    BigDecimal minSalary,
    @Schema(description = "Максимальная зарплата")
    BigDecimal maxSalary
) { }
