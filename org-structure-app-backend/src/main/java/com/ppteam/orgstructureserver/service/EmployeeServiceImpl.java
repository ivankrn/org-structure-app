package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.controller.error.NotFoundException;
import com.ppteam.orgstructureserver.database.repository.EmployeeRepository;
import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.EmployeeFullDTO;
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
    public EmployeeFullDTO findById(long id) {
        return employeeRepository.findById(id).map(mapper::convertToFullDTO).orElseThrow(NotFoundException::new);
    }

    @Override
    public List<EmployeeDTO> findByParentId(long parentId) {
        return employeeRepository.findByParentId(parentId).stream()
                .map(mapper::convertToDTO).toList();
    }

    @Override
    public List<EmployeeDTO> findByParentIdSortByFullNameAsc(long parentId) {
        return employeeRepository.findByParentIdOrderByFullNameAsc(parentId).stream()
                .map(mapper::convertToDTO).toList();
    }

    @Override
    public List<EmployeeDTO> findByFullNameContaining(String name) {
        return employeeRepository.findByFullNameContaining(name).stream()
                .map(mapper::convertToDTO).toList();
    }

    @Override
    public EmployeeDTO findOrganizationalUnitHead(long organizationalUnitId) {
        return employeeRepository.findOrganizationalUnitHead(organizationalUnitId).map(mapper::convertToDTO)
                .orElse(null);
    }

}
