package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record LegalEntityWithNestedStructuresDTO(long id, String name, List<LocationWithNestedStructuresDTO> locations) {
}
