package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.controller.error.NotFoundException;
import com.ppteam.orgstructureserver.database.model.Department;
import com.ppteam.orgstructureserver.database.repository.DepartmentRepository;
import com.ppteam.orgstructureserver.dto.DepartmentDTO;
import com.ppteam.orgstructureserver.dto.DepartmentWithNestedStructuresDTO;
import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.GroupDTO;
import com.ppteam.orgstructureserver.dto.mapper.DepartmentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeService employeeService;
    private final GroupService groupService;
    private final DepartmentMapper mapper;

    @Override
    public List<DepartmentDTO> findByDivisionId(long divisionId) {
        return departmentRepository.findByDivisionId(divisionId).stream()
                .map(department -> {
                    EmployeeDTO departmentHead = employeeService.findDepartmentHead(department.getId());
                    return mapper.convert(department, departmentHead);
                })
                .toList();
    }

    @Override
    public List<DepartmentDTO> findNotAttachedToDivisionByLegalEntityIdAndLocationId(long legalEntityId, long locationId) {
        return departmentRepository.findNotAttachedToDivisionByLegalEntityIdAndLocationId(legalEntityId, locationId)
                .stream()
                .map(department -> {
                    EmployeeDTO departmentHead = employeeService.findDepartmentHead(department.getId());
                    return mapper.convert(department, departmentHead);
                })
                .toList();
    }

    @Override
    public DepartmentWithNestedStructuresDTO findByIdWithNestedStructures(long id) {
        Department department = departmentRepository.findById(id).orElseThrow(NotFoundException::new);
        EmployeeDTO departmentHead = employeeService.findDepartmentHead(id);
        List<GroupDTO> groups = groupService.findByDepartmentId(id);
        List<EmployeeDTO> otherEmployees = employeeService.findAttachedOnlyToDepartmentId(id);
        return mapper.convert(department, departmentHead, groups, otherEmployees);
    }

}
