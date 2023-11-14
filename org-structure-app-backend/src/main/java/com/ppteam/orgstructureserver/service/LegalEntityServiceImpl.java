package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.database.model.LegalEntity;
import com.ppteam.orgstructureserver.database.repository.LegalEntityRepository;
import com.ppteam.orgstructureserver.dto.LegalEntityWithLocationsAndDivisionsDTO;
import com.ppteam.orgstructureserver.dto.LocationWithDivisionsDTO;
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
    public List<LegalEntityWithLocationsAndDivisionsDTO> findAllWithLocationsAndDivisions() {
        Iterable<LegalEntity> legalEntities = legalEntityRepository.findAll();
        List<LegalEntityWithLocationsAndDivisionsDTO> result = new ArrayList<>();
        for (LegalEntity legalEntity : legalEntities) {
            List<LocationWithDivisionsDTO> locations =
                    locationService.findAllWithDivisionsFromLegalEntity(legalEntity.getId());
            result.add(legalEntityMapper.convert(legalEntity, locations));
        }
        return result;
    }

}
