package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.JobTitleDTO;

import java.util.List;

public interface JobTitleService {

    List<JobTitleDTO> findAll();
    List<JobTitleDTO> findByNameContainingIgnoreCase(String name);

}
