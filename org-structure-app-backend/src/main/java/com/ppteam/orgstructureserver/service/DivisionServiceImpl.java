package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.controller.error.NotFoundException;
import com.ppteam.orgstructureserver.database.model.Division;
import com.ppteam.orgstructureserver.database.repository.DivisionRepository;
import com.ppteam.orgstructureserver.dto.*;
import com.ppteam.orgstructureserver.dto.mapper.DivisionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DivisionServiceImpl implements DivisionService {

    private final DivisionRepository divisionRepository;
    private final DepartmentService departmentService;
    private final GroupService groupService;
    private final EmployeeService employeeService;
    private final DivisionMapper mapper;

    @Override
    public List<DivisionDTO> findByLegalEntityIdAndLocationId(long legalEntityId, long locationId) {
        return divisionRepository.findByLegalEntityIdAndLocationId(legalEntityId, locationId)
                .stream().map(mapper::convert).toList();
    }

    @Override
    public DivisionWithNestedStructuresDTO findByIdWithNestedStructures(long id) {
        Division division = divisionRepository.findById(id).orElseThrow(NotFoundException::new);
        List<DepartmentDTO> departments = departmentService.findByDivisionId(division.getId());
        List<GroupDTO> groups = groupService.findByDivisionId(division.getId());
        List<EmployeeDTO> otherEmployees = employeeService.findAttachedOnlyToDivisionId(division.getId());
        return mapper.convert(division, departments, groups, otherEmployees);
    }

}
