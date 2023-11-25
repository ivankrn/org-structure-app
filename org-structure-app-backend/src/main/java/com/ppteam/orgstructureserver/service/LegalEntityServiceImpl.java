package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.database.model.LegalEntity;
import com.ppteam.orgstructureserver.database.repository.LegalEntityRepository;
import com.ppteam.orgstructureserver.dto.LegalEntityWithNestedStructuresDTO;
import com.ppteam.orgstructureserver.dto.LocationWithNestedStructuresDTO;
import com.ppteam.orgstructureserver.dto.mapper.LegalEntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LegalEntityServiceImpl implements LegalEntityService {

    private final LegalEntityRepository legalEntityRepository;
    private final LocationService locationService;
    private final LegalEntityMapper legalEntityMapper;

    @Override
    public List<LegalEntityWithNestedStructuresDTO> findAllWithLocationsAndDivisions() {
        Iterable<LegalEntity> legalEntities = legalEntityRepository.findAll();
        List<LegalEntityWithNestedStructuresDTO> result = new ArrayList<>();
        for (LegalEntity legalEntity : legalEntities) {
            List<LocationWithNestedStructuresDTO> locations =
                    locationService.findAllWithNestedStructuresByLegalEntityId(legalEntity.getId());
            result.add(legalEntityMapper.convert(legalEntity, locations));
        }
        return result;
    }

}
