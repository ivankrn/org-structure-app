package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.controller.error.NotFoundException;
import com.ppteam.orgstructureserver.controller.error.WrongQueryParamException;
import com.ppteam.orgstructureserver.database.model.Location;
import com.ppteam.orgstructureserver.database.model.OrganizationalUnit;
import com.ppteam.orgstructureserver.database.model.OrganizationalUnitType;
import com.ppteam.orgstructureserver.database.repository.OrganizationalUnitRepository;
import com.ppteam.orgstructureserver.dto.*;
import com.ppteam.orgstructureserver.dto.mapper.OrganizationalUnitMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

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
        EmployeeDTO head = employeeService.findOrganizationalUnitHead(id);
        List<OrganizationalUnitDTO> subsidiaries = organizationalUnit.getSubsidiaries().stream()
                .map(unit -> {
                    EmployeeDTO unitHead = employeeService.findOrganizationalUnitHead(unit.getId());
                    return mapper.convert(unit, unitHead);
                })
                .toList();
        List<EmployeeDTO> employees = employeeService.findByParentIdSortByFullNameAsc(id);
        return mapper.convert(organizationalUnit, head, subsidiaries, employees);
    }

    @Override
    public List<OrganizationalUnitDTO> findAllByType(OrganizationalUnitType type) {
        return organizationalUnitRepository.findByType(type).stream()
                .map(organizationalUnit -> {
                    EmployeeDTO head = employeeService.findOrganizationalUnitHead(organizationalUnit.getId());
                    return mapper.convert(organizationalUnit, head);
                })
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
                    EmployeeDTO head = employeeService.findOrganizationalUnitHead(unit.getId());
                    Set<OrganizationalUnit> subsidiaries = unit.getSubsidiaries();
                    Map<Location, List<OrganizationalUnit>> groupedByLocation = subsidiaries.stream()
                            .collect(groupingBy(OrganizationalUnit::getLocation));
                    List<LocationWithOrganizationalUnitsDTO> locations = groupedByLocation.entrySet().stream()
                            .map(entry -> {
                                String location = entry.getKey().getName();
                                List<OrganizationalUnitDTO> organizationalUnits = entry.getValue().stream()
                                        .map(organizationalUnit -> {
                                            EmployeeDTO organizationalUnitHead =
                                                    employeeService.findOrganizationalUnitHead(organizationalUnit.getId());
                                            return mapper.convert(organizationalUnit, organizationalUnitHead);
                                        })
                                        .toList();
                                return new LocationWithOrganizationalUnitsDTO(location, organizationalUnits);
                            })
                            .toList();
                    return mapper.convert(unit, head, locations);
                })
                .toList();
    }

    @Override
    public List<OrganizationalUnitDTO> findByNameContainingIgnoreCase(String name) {
        return organizationalUnitRepository.findByNameContainingIgnoreCase(name).stream()
                .map(unit -> {
                    EmployeeDTO head = employeeService.findOrganizationalUnitHead(unit.getId());
                    return mapper.convert(unit, head);
                })
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
