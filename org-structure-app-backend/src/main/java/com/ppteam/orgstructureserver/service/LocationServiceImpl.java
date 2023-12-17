package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.database.repository.LocationRepository;
import com.ppteam.orgstructureserver.dto.LocationDTO;
import com.ppteam.orgstructureserver.dto.mapper.LocationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final LocationMapper mapper;

    @Override
    public List<LocationDTO> findAll() {
        return locationRepository.findAll().stream().map(mapper::convert).toList();
    }

}
