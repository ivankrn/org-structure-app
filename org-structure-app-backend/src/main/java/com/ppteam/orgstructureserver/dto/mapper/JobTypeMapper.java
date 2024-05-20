package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.JobType;
import com.ppteam.orgstructureserver.dto.JobTypeDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface JobTypeMapper {

    JobTypeDTO convert(JobType jobType);

}
