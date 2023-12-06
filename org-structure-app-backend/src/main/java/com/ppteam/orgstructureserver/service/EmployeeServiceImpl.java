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
    public List<EmployeeDTO> findByParentId(long parentId) {
        return employeeRepository.findByParentId(parentId).stream()
                .map(mapper::convert).toList();
    }

    @Override
    public List<EmployeeDTO> findByParentIdSortByFullNameAsc(long parentId) {
        return employeeRepository.findByParentIdOrderByFullNameAsc(parentId).stream()
                .map(mapper::convert).toList();
    }

    @Override
    public List<EmployeeDTO> findByFullNameContaining(String name) {
        return employeeRepository.findByFullNameContaining(name).stream()
                .map(mapper::convert).toList();
    }

    @Override
    public EmployeeDTO findOrganizationalUnitHead(long organizationalUnitId) {
        return mapper.convert(employeeRepository.findOrganizationalUnitHead(organizationalUnitId).orElse(null));
    }

}
