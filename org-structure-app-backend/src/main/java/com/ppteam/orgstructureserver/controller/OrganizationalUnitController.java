package com.ppteam.orgstructureserver.controller;

import com.ppteam.orgstructureserver.database.model.OrganizationalUnitType;
import com.ppteam.orgstructureserver.database.repository.CustomAggregationStatisticsRepository;
import com.ppteam.orgstructureserver.dto.*;
import com.ppteam.orgstructureserver.service.OrganizationalUnitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Организационные единицы")
@RestController
@RequestMapping("/api/organizational-units")
@RequiredArgsConstructor
public class OrganizationalUnitController {

    private final OrganizationalUnitService organizationalUnitService;

    @Operation(summary = "Получить организационную единицу по ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Найденная организационная единица",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = OrganizationalUnitWithSubsidiariesDTO.class))}),
            @ApiResponse(responseCode = "404", description = "Если организационная единица не найдена",
                    content = @Content),
    })
    @GetMapping("/{id}")
    public OrganizationalUnitWithSubsidiariesDTO findUnitById(@Parameter(description = "ID организационной единицы")
                                                              @PathVariable long id) {
        return organizationalUnitService.findByIdWithSubsidiaries(id);
    }

    @Operation(summary = "Найти организационные единицы по свойству")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Найденные организационные единицы",
                    content = {@Content(mediaType = "application/json",
                            array = @ArraySchema(
                                schema = @Schema(implementation = OrganizationalUnitDTO.class)
                            ))}),
            @ApiResponse(responseCode = "400",
                    description = "Если указан неправильный тип или свойство для группировки",
                    content = @Content),
    })
    @GetMapping(params = "type")
    public List<OrganizationalUnitDTO> findUnitsByType(@Parameter(description = "Тип организационной единицы")
                                                       @RequestParam(required = false) OrganizationalUnitType type) {
        return organizationalUnitService.findAllByType(type);
    }

    @GetMapping(params = {"type", "group-by"})
    public List<OrganizationalUnitWithLocationsDTO> findUnitsByTypeGroupByProperty(
            @Parameter(description = "Тип организационной единицы")
            @RequestParam(required = false) OrganizationalUnitType type,
            @Parameter(
                    description = "Свойство для группировки",
                    schema = @Schema(allowableValues = "location"))
            @RequestParam(value = "group-by", required = false) String property) {
        return organizationalUnitService.findAllByTypeGroupByProperty(type, property);
    }

    @GetMapping(params = "name")
    public List<OrganizationalUnitDTO> findUnitsByNameContaining(@Parameter(description = "Название для поиска")
                                                                 @RequestParam(required = false) String name) {
        return organizationalUnitService.findByNameContainingIgnoreCase(name);
    }

    @Operation(summary = "Получить иерархию организационной единицы по её ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Иерархия найденной организационной единицы",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = OrganizationalUnitHierarchyDTO.class))}),
            @ApiResponse(responseCode = "404", description = "Если организационная единица не найдена",
                    content = @Content),
    })
    @GetMapping("/{id}/hierarchy")
    public OrganizationalUnitHierarchyDTO findUnitHierarchy(@Parameter(description = "ID организационной единицы")
                                                                @PathVariable long id) {
        return organizationalUnitService.findHierarchyByUnitId(id);
    }

    @Operation(summary = "Получить список имен организационных единиц")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Названия организационных единиц",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = Map.class))})
    })
    @GetMapping(value = "/names")
    public Map<String, List<String>> findNamesByTypes() {
        return organizationalUnitService.findNamesByTypes();
    }

    @Operation(summary = "Получить агрегированную информацию по id организационных единиц")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Агрегированная информация",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = OrganizationalUnitsAggregationInfoDTO.class))}),
    })
    @GetMapping("/aggregation")
    public OrganizationalUnitsAggregationInfoDTO calculateAggregationInfo(@Parameter(description = "Список id организационных единиц")
                                                    @RequestParam("ids") List<Long> ids) {

        return organizationalUnitService.calculateAggregationInfo(ids);
    }
}
