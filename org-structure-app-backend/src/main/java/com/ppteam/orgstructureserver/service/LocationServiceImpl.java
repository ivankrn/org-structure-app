package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.database.model.Location;
import com.ppteam.orgstructureserver.database.repository.LocationRepository;
import com.ppteam.orgstructureserver.dto.DepartmentDTO;
import com.ppteam.orgstructureserver.dto.DivisionDTO;
import com.ppteam.orgstructureserver.dto.GroupDTO;
import com.ppteam.orgstructureserver.dto.LocationWithNestedStructuresDTO;
import com.ppteam.orgstructureserver.dto.mapper.LocationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final DivisionService divisionService;
    private final DepartmentService departmentService;
    private final GroupService groupService;
    private final LocationMapper locationMapper;

    @Override
    public List<LocationWithNestedStructuresDTO> findAllWithNestedStructuresByLegalEntityId(long legalEntityId) {
        Iterable<Location> locations = locationRepository.findAll();
        List<LocationWithNestedStructuresDTO> result = new ArrayList<>();
        for (Location location : locations) {
            List<DivisionDTO> divisions = divisionService.findByLegalEntityIdAndLocationId(legalEntityId, location.getId());
            List<DepartmentDTO> departments =
                    departmentService.findNotAttachedToDivisionByLegalEntityIdAndLocationId(legalEntityId, location.getId());
            List<GroupDTO> groups =
                    groupService.findNotAttachedByLegalEntityIdAndLocationId(legalEntityId, location.getId());
            result.add(locationMapper.locationWithNestedStructuresToDTO(location, divisions, departments, groups));
        }
        return result;
    }

}
