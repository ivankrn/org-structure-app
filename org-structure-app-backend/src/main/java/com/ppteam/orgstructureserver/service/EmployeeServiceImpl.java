package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.controller.error.NotFoundException;
import com.ppteam.orgstructureserver.database.model.Employee;
import com.ppteam.orgstructureserver.database.model.OrganizationalUnit;
import com.ppteam.orgstructureserver.database.model.OrganizationalUnitType;
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
        Employee employee = employeeRepository.findById(id).orElseThrow(NotFoundException::new);
        OrganizationalUnit unit = employee.getParent();
        OrganizationalUnit group = null;
        OrganizationalUnit department = null;
        OrganizationalUnit division = null;
        if (unit.getType() == OrganizationalUnitType.GROUP) {
            group = unit;
            OrganizationalUnit groupParent = group.getParent();
            switch (groupParent.getType()) {
                case DEPARTMENT -> {
                    department = groupParent;
                    OrganizationalUnit departmentParent = department.getParent();
                    if (departmentParent.getType() == OrganizationalUnitType.DIVISION) {
                        division = departmentParent;
                    }
                }
                case DIVISION -> division = groupParent;
            }
        } else if (unit.getType() == OrganizationalUnitType.DEPARTMENT) {
            department = unit;
            OrganizationalUnit parent = department.getParent();
            if (parent.getType() == OrganizationalUnitType.DIVISION) {
                division = parent;
            }
        } else if (unit.getType() == OrganizationalUnitType.DIVISION) {
            division = unit;
        }
        return mapper.convertToFullDTO(employee, division, department, group);
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
