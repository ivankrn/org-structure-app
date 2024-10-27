package com.ppteam.orgstructureserver.service.impl;

import com.ppteam.orgstructureserver.controller.error.NotFoundException;
import com.ppteam.orgstructureserver.controller.error.WrongQueryParamException;
import com.ppteam.orgstructureserver.database.model.Location;
import com.ppteam.orgstructureserver.database.model.OrganizationalUnit;
import com.ppteam.orgstructureserver.database.model.OrganizationalUnitType;
import com.ppteam.orgstructureserver.database.repository.OrganizationalUnitRepository;
import com.ppteam.orgstructureserver.dto.*;
import com.ppteam.orgstructureserver.dto.mapper.OrganizationalUnitMapper;
import com.ppteam.orgstructureserver.service.EmployeeService;
import com.ppteam.orgstructureserver.service.OrganizationalUnitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.ppteam.orgstructureserver.database.repository.OrganizationalUnitCustomRepository.JobTitlesStatisticsRecord;
import static com.ppteam.orgstructureserver.database.repository.OrganizationalUnitCustomRepository.OrganizationalUnitsAggregationRecord;
import static java.util.stream.Collectors.groupingBy;

@Service
@RequiredArgsConstructor
public class OrganizationalUnitServiceImpl implements OrganizationalUnitService {

    private final OrganizationalUnitRepository organizationalUnitRepository;
    private final EmployeeService employeeService;
    private final OrganizationalUnitMapper mapper;

    @Override
    public OrganizationalUnitWithSubsidiariesDTO findByIdWithSubsidiaries(long id) {
        OrganizationalUnit organizationalUnit = organizationalUnitRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        List<OrganizationalUnitDTO> subsidiaries = organizationalUnit.getSubsidiaries().stream()
                .map(mapper::convert)
                .toList();
        List<EmployeeDTO> employees = employeeService.findByParentIdSortByFullNameAsc(id);
        return mapper.convert(organizationalUnit, subsidiaries, employees);
    }

    @Override
    public List<OrganizationalUnitDTO> findAllByType(OrganizationalUnitType type) {
        return organizationalUnitRepository.findByType(type).stream()
                .map(mapper::convert)
                .toList();
    }

    @Override
    public List<OrganizationalUnitWithLocationsDTO> findAllByTypeGroupByProperty(OrganizationalUnitType type,
                                                                                 String property) {
        if (!property.equalsIgnoreCase("location")) {
            throw new WrongQueryParamException();
        }
        return organizationalUnitRepository.findByType(type).stream()
                .map(unit -> {
                    Set<OrganizationalUnit> subsidiaries = unit.getSubsidiaries();
                    Map<Location, List<OrganizationalUnit>> groupedByLocation = subsidiaries.stream()
                            .collect(groupingBy(OrganizationalUnit::getLocation));
                    List<LocationWithOrganizationalUnitsDTO> locations = groupedByLocation.entrySet().stream()
                            .map(entry -> {
                                String location = entry.getKey().getName();
                                List<OrganizationalUnitDTO> organizationalUnits = entry.getValue().stream()
                                        .map(mapper::convert)
                                        .toList();
                                return new LocationWithOrganizationalUnitsDTO(location, organizationalUnits);
                            })
                            .toList();
                    return mapper.convert(unit, locations);
                })
                .toList();
    }

    @Override
    public List<OrganizationalUnitDTO> findByNameContainingIgnoreCase(String name) {
        return organizationalUnitRepository.findByNameContainingIgnoreCase(name).stream()
                .map(mapper::convert)
                .toList();
    }

    @Override
    public OrganizationalUnitHierarchyDTO findHierarchyByUnitId(long unitId) {
        OrganizationalUnit unit = organizationalUnitRepository.findById(unitId).orElseThrow(NotFoundException::new);
        OrganizationalUnit legalEntity = null;
        OrganizationalUnit division = null;
        OrganizationalUnit department = null;
        OrganizationalUnit group = null;
        List<OrganizationalUnit> hierarchy = findUnitHierarchy(unit);
        for (OrganizationalUnit hierarchyUnit : hierarchy) {
            switch (hierarchyUnit.getType()) {
                case LEGAL_ENTITY -> legalEntity = hierarchyUnit;
                case DIVISION -> division = hierarchyUnit;
                case DEPARTMENT -> department = hierarchyUnit;
                case GROUP -> group = hierarchyUnit;
            }
        }
        return mapper.convert(legalEntity, division, department, group);
    }

    @Override
    public Map<String, List<String>> findNamesByTypes() {
        Map<String, List<String>> result = new HashMap<>(OrganizationalUnitType.values().length);
        for (OrganizationalUnitType type : OrganizationalUnitType.values()) {
            result.put(type.toString(), organizationalUnitRepository.findNamesByType(type));
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public OrganizationalUnitsAggregationInfoDTO calculateAggregationInfo(Collection<Long> organizationalUnitsIds) {
        List<Long> idsList = organizationalUnitsIds.stream().toList();
        OrganizationalUnitsAggregationRecord aggregationInfo = organizationalUnitRepository
                .calculateOrganizationalUnitsAggregation(idsList);
        List<JobTitlesStatisticsRecord> jobTitlesStatistics = organizationalUnitRepository
                .calculateJobTitlesStatistics(idsList);
        return mapper.convert(aggregationInfo, jobTitlesStatistics);
    }

    private List<OrganizationalUnit> findUnitHierarchy(OrganizationalUnit unit) {
        List<OrganizationalUnit> hierarchy = new ArrayList<>();
        hierarchy.add(unit);
        while (unit.getParent() != null) {
            hierarchy.add(unit.getParent());
            unit = unit.getParent();
        }
        return hierarchy;
    }
}
