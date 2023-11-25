package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record GroupWithEmployeesDTO(long id, String name, EmployeeDTO head, List<EmployeeDTO> employees) {
}
