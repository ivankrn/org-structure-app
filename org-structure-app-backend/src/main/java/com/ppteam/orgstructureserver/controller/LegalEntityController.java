package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.dto.LegalEntityWithLocationsAndDivisionsDTO;
import com.ppteam.orgstructureserver.service.LegalEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/legal-entities")
@RequiredArgsConstructor
public class LegalEntityController {

    private final LegalEntityService legalEntityService;

    @GetMapping
    public List<LegalEntityWithLocationsAndDivisionsDTO> getLegalEntities() {
        return legalEntityService.findAllWithLocationsAndDivisions();
    }

}
