package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.database.repository.GroupRepository;
import com.ppteam.orgstructureserver.dto.EmployeeDTO;
import com.ppteam.orgstructureserver.dto.GroupDTO;
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

}
