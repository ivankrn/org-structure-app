package com.ppteam.orgstructureserver.service.impl;

import com.ppteam.orgstructureserver.controller.error.NotFoundException;
import com.ppteam.orgstructureserver.database.repository.ProjectRepository;
import com.ppteam.orgstructureserver.dto.ProjectDTO;
import com.ppteam.orgstructureserver.dto.ProjectWithEmployeesDTO;
import com.ppteam.orgstructureserver.dto.mapper.ProjectMapper;
import com.ppteam.orgstructureserver.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper mapper;

    @Override
    public ProjectWithEmployeesDTO findById(long id) {
        return projectRepository.findById(id).map(mapper::convertToFullDTO).orElseThrow(NotFoundException::new);
    }

    @Override
    public List<ProjectDTO> findByNameContainingIgnoreCase(String name) {
        return projectRepository.findByNameContainingIgnoreCase(name).stream().map(mapper::convert).toList();
    }

}
