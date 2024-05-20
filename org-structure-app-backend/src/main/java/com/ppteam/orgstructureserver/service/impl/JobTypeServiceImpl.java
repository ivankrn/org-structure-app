package com.ppteam.orgstructureserver.service.impl;

import com.ppteam.orgstructureserver.database.repository.JobTypeRepository;
import com.ppteam.orgstructureserver.dto.JobTypeDTO;
import com.ppteam.orgstructureserver.dto.mapper.JobTypeMapper;
import com.ppteam.orgstructureserver.service.JobTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobTypeServiceImpl implements JobTypeService {

    private final JobTypeRepository jobTypeRepository;
    private final JobTypeMapper mapper;

    @Override
    public List<JobTypeDTO> findAll() {
        return jobTypeRepository.findAll().stream().map(mapper::convert).toList();
    }

    @Override
    public List<JobTypeDTO> findByNameContainingIgnoreCase(String name) {
        return jobTypeRepository.findByNameContainingIgnoreCase(name).stream().map(mapper::convert).toList();
    }


}
