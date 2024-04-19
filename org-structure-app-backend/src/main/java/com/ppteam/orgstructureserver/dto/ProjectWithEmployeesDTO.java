package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record ProjectWithEmployeesDTO(long id, String name, List<EmployeeDTO> employees) {
}
