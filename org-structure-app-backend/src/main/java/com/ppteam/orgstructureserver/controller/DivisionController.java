package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.dto.DivisionWithNestedStructuresDTO;
import com.ppteam.orgstructureserver.service.DivisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/divisions")
@RequiredArgsConstructor
public class DivisionController {

    private final DivisionService divisionService;

    @GetMapping("/{id}")
    public DivisionWithNestedStructuresDTO getDivisionById(@PathVariable long id) {
        return divisionService.findByIdWithNestedStructures(id);
    }

}
