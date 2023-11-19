package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.database.repository.EmployeeRepository;
import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.mapper.EmployeeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper mapper;

    @Override
    public List<EmployeeDTO> findAttachedOnlyToDivisionId(long divisionId) {
        return employeeRepository.findAttachedOnlyToDivisionId(divisionId)
                .stream().map(mapper::convert).toList();
    }

    @Override
    public EmployeeDTO findDivisionHead(long divisionId) {
        return mapper.convert(employeeRepository.findDivisionHead(divisionId).orElse(null));
    }

    @Override
    public EmployeeDTO findDepartmentHead(long departmentId) {
        return mapper.convert(employeeRepository.findDepartmentHead(departmentId).orElse(null));
    }

    @Override
    public EmployeeDTO findGroupHead(long groupId) {
        return mapper.convert(employeeRepository.findGroupHead(groupId).orElse(null));
    }

}
