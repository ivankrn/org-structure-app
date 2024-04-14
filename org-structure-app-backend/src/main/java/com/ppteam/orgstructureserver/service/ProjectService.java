package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.ProjectDTO;
import com.ppteam.orgstructureserver.dto.ProjectWithEmployeesDTO;

import java.util.List;

public interface ProjectService {

    ProjectWithEmployeesDTO findById(long id);
    List<ProjectDTO> findByNameContainingIgnoreCase(String name);

}
