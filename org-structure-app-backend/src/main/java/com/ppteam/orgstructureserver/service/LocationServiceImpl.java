package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.database.model.Division;
import com.ppteam.orgstructureserver.database.model.Location;
import com.ppteam.orgstructureserver.database.repository.DivisionRepository;
import com.ppteam.orgstructureserver.database.repository.LocationRepository;
import com.ppteam.orgstructureserver.dto.LocationWithDivisionsDTO;
import com.ppteam.orgstructureserver.dto.mapper.LocationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final DivisionRepository divisionRepository;
    private final LocationMapper locationMapper;

    @Override
    public List<LocationWithDivisionsDTO> findAllWithDivisionsFromLegalEntity(long legalEntityId) {
        Iterable<Location> locations = locationRepository.findAll();
        List<LocationWithDivisionsDTO> result = new ArrayList<>();
        for (Location location : locations) {
            List<Division> divisions = divisionRepository.findByLegalEntityIdAndLocationId(legalEntityId, location.getId());
            result.add(locationMapper.locationWithDivisionsToDTO(location, divisions));
        }
        return result;
    }

}
