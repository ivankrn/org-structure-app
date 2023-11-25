package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.controller.error.NotFoundException;
import com.ppteam.orgstructureserver.database.model.Group;
import com.ppteam.orgstructureserver.database.repository.GroupRepository;
import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.GroupDTO;
import com.ppteam.orgstructureserver.dto.GroupWithEmployeesDTO;
import com.ppteam.orgstructureserver.dto.mapper.GroupMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final EmployeeService employeeService;
    private final GroupMapper mapper;

    @Override
    public List<GroupDTO> findByDivisionId(long divisionId) {
        return groupRepository.findByDivisionId(divisionId).stream()
                .map(group -> {
                    EmployeeDTO groupHead = employeeService.findGroupHead(group.getId());
                    return mapper.convert(group, groupHead);
                })
                .toList();
    }

    @Override
    public List<GroupDTO> findAttachedOnlyToDivisionId(long divisionId) {
        return groupRepository.findAttachedOnlyToDivisionId(divisionId).stream()
                .map(group -> {
                    EmployeeDTO groupHead = employeeService.findGroupHead(group.getId());
                    return mapper.convert(group, groupHead);
                })
                .toList();
    }

    @Override
    public List<GroupDTO> findByDepartmentId(long departmentId) {
        return groupRepository.findByDepartmentId(departmentId).stream()
                .map(group -> {
                    EmployeeDTO groupHead = employeeService.findGroupHead(group.getId());
                    return mapper.convert(group, groupHead);
                })
                .toList();
    }

    @Override
    public List<GroupDTO> findNotAttachedByLegalEntityIdAndLocationId(long legalEntityId, long locationId) {
        return groupRepository.findNotAttachedByLegalEntityIdAndLocationId(legalEntityId, locationId)
                .stream()
                .map(group -> {
                    EmployeeDTO groupHead = employeeService.findGroupHead(group.getId());
                    return mapper.convert(group, groupHead);
                })
                .toList();
    }

    @Override
    public GroupWithEmployeesDTO findByIdWithEmployees(long id) {
        Group group = groupRepository.findById(id).orElseThrow(NotFoundException::new);
        EmployeeDTO head = employeeService.findGroupHead(id);
        List<EmployeeDTO> employees = employeeService.findByGroupId(id);
        return mapper.convert(group, head, employees);
    }

}
