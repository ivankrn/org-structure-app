package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.database.repository.DepartmentRepository;
import com.ppteam.orgstructureserver.dto.DepartmentDTO;
import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.mapper.DepartmentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeService employeeService;
    private final DepartmentMapper mapper;

    @Override
    public List<DepartmentDTO> findByDivisionId(long divisionId) {
        return departmentRepository.findByDivisionId(divisionId).stream()
                .map(department -> {
                    EmployeeDTO divisionHead = employeeService.findDepartmentHead(department.getId());
                    return mapper.convert(department, divisionHead);
                })
                .toList();
    }

}
