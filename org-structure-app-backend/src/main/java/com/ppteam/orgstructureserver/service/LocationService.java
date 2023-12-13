package com.ppteam.orgstructureserver.service;

import com.ppteam.orgstructureserver.dto.LocationDTO;

import java.util.List;

public interface LocationService {

    List<LocationDTO> findAll();

}
