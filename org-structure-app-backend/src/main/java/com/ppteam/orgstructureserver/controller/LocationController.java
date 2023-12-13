package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.dto.LocationDTO;
import com.ppteam.orgstructureserver.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping
    public List<LocationDTO> findAll() {
        return locationService.findAll();
    }

}
