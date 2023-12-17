package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.database.model.OrganizationalUnitType;
import com.ppteam.orgstructureserver.dto.OrganizationalUnitDTO;
import com.ppteam.orgstructureserver.dto.OrganizationalUnitHierarchyDTO;
import com.ppteam.orgstructureserver.dto.OrganizationalUnitWithLocationsDTO;
import com.ppteam.orgstructureserver.dto.OrganizationalUnitWithSubsidiariesDTO;
import com.ppteam.orgstructureserver.service.OrganizationalUnitService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/organizational-units")
@RequiredArgsConstructor
public class OrganizationalUnitController {

    private final OrganizationalUnitService organizationalUnitService;

    @GetMapping("/{id}")
    public OrganizationalUnitWithSubsidiariesDTO findUnitById(@PathVariable long id) {
        return organizationalUnitService.findByIdWithSubsidiaries(id);
    }

    @GetMapping(params = "type")
    public List<OrganizationalUnitDTO> findUnitsByType(@RequestParam OrganizationalUnitType type) {
        return organizationalUnitService.findAllByType(type);
    }

    @GetMapping(params = {"type", "sort"})
    public List<OrganizationalUnitDTO> findUnitsByTypeSortByProperty(@RequestParam OrganizationalUnitType type,
                                                             @RequestParam("sort") String property) {
        return organizationalUnitService.findAllByTypeSortByProperty(type, property);
    }

    @GetMapping(params = {"type", "group-by"})
    public List<OrganizationalUnitWithLocationsDTO> findUnitsByTypeGroupByProperty(
            @RequestParam OrganizationalUnitType type,
            @RequestParam("group-by") String property) {
        return organizationalUnitService.findAllByTypeGroupByProperty(type, property);
    }

    @GetMapping(params = "name")
    public List<OrganizationalUnitDTO> findUnitsByNameContaining(@RequestParam String name) {
        return organizationalUnitService.findByNameContainingIgnoreCase(name);
    }

    @GetMapping("/{id}/hierarchy")
    public OrganizationalUnitHierarchyDTO findUnitHierarchy(@PathVariable long id) {
        return organizationalUnitService.findHierarchyByUnitId(id);
    }

    @GetMapping(value = "/names", params = {"type", "name"})
    public List<String> findByTypeUnitNamesContaining(
            @RequestParam OrganizationalUnitType type,
            @RequestParam String name) {
        return organizationalUnitService.findByTypeNamesContaining(type, name);
    }

    @GetMapping(value = "/names")
    public Map<String, List<String>> findNamesByTypes() {
        return organizationalUnitService.findNamesByTypes();
    }

}
