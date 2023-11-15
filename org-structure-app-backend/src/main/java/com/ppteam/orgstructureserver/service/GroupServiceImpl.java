package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.database.repository.GroupRepository;
import com.ppteam.orgstructureserver.dto.GroupDTO;
import com.ppteam.orgstructureserver.dto.mapper.GroupMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final GroupMapper mapper;

    @Override
    public List<GroupDTO> findByDivisionId(long divisionId) {
        return groupRepository.findByDivisionId(divisionId).stream().map(mapper::convert).toList();
    }

}
