package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.GroupDTO;
import com.ppteam.orgstructureserver.dto.GroupWithEmployeesDTO;

import java.util.List;

public interface GroupService {

    List<GroupDTO> findByDivisionId(long divisionId);
    GroupWithEmployeesDTO findByIdWithEmployees(long id);

}
