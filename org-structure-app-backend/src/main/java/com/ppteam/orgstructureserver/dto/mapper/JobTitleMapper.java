package com.ppteam.orgstructureserver.dto.mapper;

import com.ppteam.orgstructureserver.database.model.JobTitle;
import com.ppteam.orgstructureserver.dto.JobTitleDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface JobTitleMapper {

    JobTitleDTO convert(JobTitle jobTitle);

}
