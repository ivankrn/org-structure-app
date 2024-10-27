package com.ppteam.orgstructureserver.service.impl;

import com.ppteam.orgstructureserver.controller.error.NotFoundException;
import com.ppteam.orgstructureserver.database.repository.EmployeeRepository;
import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.EmployeeFullDTO;
import com.ppteam.orgstructureserver.dto.mapper.EmployeeMapper;
import com.ppteam.orgstructureserver.service.EmployeeService;
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
    public List<EmployeeDTO> findByFullNameContainingIgnoreCase(String name) {
        return employeeRepository.findByFullNameContainingIgnoreCase(name).stream()
                .map(mapper::convertToDTO).toList();
    }

}
