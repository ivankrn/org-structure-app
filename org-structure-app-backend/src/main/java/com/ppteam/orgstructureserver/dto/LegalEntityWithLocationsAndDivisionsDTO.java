package com.ppteam.orgstructureserver.dto;

import java.util.List;

public record LegalEntityWithLocationsAndDivisionsDTO(long id, String name, List<LocationWithDivisionsDTO> locations) {
}
