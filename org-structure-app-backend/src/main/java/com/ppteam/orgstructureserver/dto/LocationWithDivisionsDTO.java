package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record LocationWithDivisionsDTO(long id, String name, List<DivisionDTO> divisions) {
}
