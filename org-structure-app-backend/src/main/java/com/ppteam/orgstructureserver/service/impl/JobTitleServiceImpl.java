package com.ppteam.orgstructureserver.service.impl;

import com.ppteam.orgstructureserver.database.repository.JobTitleRepository;
import com.ppteam.orgstructureserver.dto.JobTitleDTO;
import com.ppteam.orgstructureserver.dto.mapper.JobTitleMapper;
import com.ppteam.orgstructureserver.service.JobTitleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobTitleServiceImpl implements JobTitleService {

    private final JobTitleRepository jobTitleRepository;
    private final JobTitleMapper mapper;

    @Override
    public List<JobTitleDTO> findAll() {
        return jobTitleRepository.findAll().stream().map(mapper::convert).toList();
    }

    @Override
    public List<JobTitleDTO> findByNameContainingIgnoreCase(String name) {
        return jobTitleRepository.findByNameContainingIgnoreCase(name).stream().map(mapper::convert).toList();
    }

}
