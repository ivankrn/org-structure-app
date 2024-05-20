package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.JobTypeDTO;

import java.util.List;

public interface JobTypeService {

    List<JobTypeDTO> findAll();
    List<JobTypeDTO> findByNameContainingIgnoreCase(String name);

}
