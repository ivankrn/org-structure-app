package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.GroupDTO;
import com.ppteam.orgstructureserver.dto.GroupWithEmployeesDTO;

import java.util.List;

public interface GroupService {

    List<GroupDTO> findByDivisionId(long divisionId);
    List<GroupDTO> findAttachedOnlyToDivisionId(long divisionId);
    List<GroupDTO> findByDepartmentId(long departmentId);
    List<GroupDTO> findNotAttachedByLegalEntityIdAndLocationId(long legalEntityId, long locationId);
    GroupWithEmployeesDTO findByIdWithEmployees(long id);

}
