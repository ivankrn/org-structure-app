import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import * as d3 from 'd3';
import { concatMap, forkJoin, map, Subject, takeUntil, tap, timer } from 'rxjs';
import { Employee } from '../../model/employee.model';
import { OrganizationalUnitHierarchy } from '../../model/organizational-unit-hierarchy.model';
import { OrganizationalUnitType } from '../../model/organizational-unit-type.enum';
import { WithUnitTypeNamePipe } from '../../pipe/with-unit-type-name.pipe';
import { EmployeeService } from '../../service/employee.service';
import { LocationService } from '../../service/location.service';
import { OrganizationalUnitService } from '../../service/organizational-unit.service';
import { EmployeeInfoComponent } from '../employee-info/employee-info.component';
import { FilterMenuSettings } from '../filter-menu/filter-menu-settings.model';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';
import { TreeSearchBarComponent } from '../search-bar/tree-search-bar.component';
import { OrganizationalTreeNodeType } from './model/organizational-tree-node-type.enum';
import { OrganizationalTreeNode } from './model/organizational-tree-node.model';
import { convertProject, convertUnit, convertUnitGroupedByLocations } from './util/organizational-tree-util';
import {
  EmployeeFilterChainNode,
  FilterChainNode,
  LocationFilterChainNode,
  UnitHierarchyFilterChainNode
} from './util/filter/filter-chain-node';
import { OrganizationalUnit } from '../../model/organizational-unit.model';
import { ProjectService } from '../../service/project.service';
import { Project } from '../../model/project.model';
import { JobTitleService } from '../../service/job-title.service';
import { JobTypeService } from '../../service/job-type.service';
import { FooterComponent } from '../footer/footer.component';
import { SELECTED_UNITS } from '../../tokens/selected-units.token';
import { SelectedUnit } from '../../model/selected-unit.model';
import { InfoComponent } from '../info/info.component';
import { Gender } from '../../model/gender.enum';

@Component({
  selector: 'app-organizational-tree',
  standalone: true,
  imports: [CommonModule, EmployeeInfoComponent, FilterMenuComponent, TreeSearchBarComponent, FooterComponent, InfoComponent],
  providers: [
    OrganizationalUnitService,
    EmployeeService,
    ProjectService,
    LocationService,
    WithUnitTypeNamePipe,
    { provide: SELECTED_UNITS, useValue: new Subject<number[]>() }
  ],
  templateUrl: './organizational-tree.component.html',
  styleUrl: './organizational-tree.component.css'
})
export class OrganizationalTreeComponent implements OnInit {

  private mainTree?: OrganizationalTreeNode;
  private treeData?: OrganizationalTreeNode;
  private svg?: d3.Selection<any, any, any, any>;
  private graph?: d3.Selection<any, any, any, any>;
  private zoom?: d3.ZoomBehavior<any, any>;
  private selectedUnitsIds: Set<number> = new Set();
  private filterSettings?: FilterMenuSettings;
  private filterChain?: FilterChainNode;
  selectedEmployee: WritableSignal<Employee | undefined> = signal(undefined);
  selectedUnit: WritableSignal<SelectedUnit | undefined> = signal(undefined);
  selectedType: WritableSignal<string | undefined> = signal(undefined);
  locationNames?: string[];
  divisions?: OrganizationalUnit[];
  departments?: OrganizationalUnit[];
  groups?: OrganizationalUnit[];
  jobTitles?: string[];
  jobTypes?: string[];
  genders: Gender[] = [Gender.MALE, Gender.FEMALE];

  private width = 1200;
  private height = 1200;
  private cx = this.width * 0.5;
  private cy = this.height * 0.495;
  private radius = Math.min(this.width, this.height) / 2 - 350;
  private redrawAnimationDurationInMs = 250;
  private currentCenterType: OrganizationalTreeNodeType = OrganizationalTreeNodeType.LEGAL_ENTITY;
  private lastClickedDate: Date = new Date();
  private expand$: Subject<void> = new Subject<void>();

  private organizationalUnitService: OrganizationalUnitService = inject(OrganizationalUnitService);
  private projectService: ProjectService = inject(ProjectService);
  private employeeService: EmployeeService = inject(EmployeeService);
  private locationService: LocationService = inject(LocationService);
  private jobTitleService: JobTitleService = inject(JobTitleService);
  private jobTypeService: JobTypeService = inject(JobTypeService);
  private selectedUnits: Subject<number[]> = inject(SELECTED_UNITS);

  ngOnInit(): void {
    this.initTree();
    this.initFilters();
  }

  private initTree(): void {
    this.organizationalUnitService.findByTypeGroupedByLocation(OrganizationalUnitType.LEGAL_ENTITY)
      .subscribe(data => {
        this.createSvg();
        this.mainTree = convertUnitGroupedByLocations(data[0]); // на текущем этапе у нас только одно юр. лицо
        this.treeData = this.mainTree;
        this.redrawTree();
        /** У корня id=1, поэтому при его передаче мы получаем все дерево */
        this.selectedUnits.next([1]);
      });
    this.locationService.findAll()
      .subscribe(data => {
        this.locationNames = data.map(location => location.name);
      });
    this.organizationalUnitService
      .findByTypeAndName(OrganizationalUnitType.DIVISION)
      .subscribe(data => this.divisions = data);
    this.organizationalUnitService
      .findByTypeAndName(OrganizationalUnitType.DEPARTMENT)
      .subscribe(data => this.departments = data);
    this.organizationalUnitService
      .findByTypeAndName(OrganizationalUnitType.GROUP)
      .subscribe(data => this.groups = data);
    this.jobTitleService.findAll().subscribe(data => this.jobTitles = data.map(jobTitle => jobTitle.name));
    this.jobTypeService.findAll().subscribe(data => this.jobTypes = data.map(jobType => jobType.name));
  }

  private initFilters() {
    const locationFilterNode = new LocationFilterChainNode();
    const employeeFilterNode = new EmployeeFilterChainNode();
    const unitFilterNode = new UnitHierarchyFilterChainNode();
    locationFilterNode.nextFilter = employeeFilterNode;
    employeeFilterNode.nextFilter = unitFilterNode;
    this.filterChain = locationFilterNode;
  }

  private createSvg(): void {
    this.zoom = d3.zoom()
      .extent([[0, 0], [this.width, this.height]])
      .scaleExtent([0.5, 5])
      .on("start", () => d3.selectAll(".label") // оптимизация скорости в Chromium браузерах на ПК
        .style("will-change", "transform"))
      .on("end", () => d3.selectAll(".label")
        .style("will-change", null))
      .on("zoom", this.handleZoom);
    const delta = 300;
    this.svg = d3.select("figure#tree")
      .append("svg")
      .attr("viewBox", [-this.cx - delta / 2, -this.cy + delta / 2, this.width + delta, this.height + delta])
      .call(this.zoom);
    this.graph = this.svg.append("g");
  }

  private handleZoom(e: any): void {
    d3.select("svg g")
      .attr("transform", e.transform);
  }

  private redrawTree(): void {
    if (this.treeData == undefined) {
      return;
    }
    const filteredData: OrganizationalTreeNode = this.filterTreeDataFromSettings(this.treeData);
    const hierarchy = d3.hierarchy(filteredData)
      .sort((a, b) => d3.ascending(a.data.name, b.data.name));
    const tree = d3.cluster()
      .size([2 * Math.PI, this.radius * hierarchy.height])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
    const root = tree(<any>hierarchy);
    this.correctDepth(root);

    this.redrawTreeLinks(root);
    this.redrawTreeNodes(root);
    this.redrawTreeLabels(root);
  }

  private correctDepth(root: d3.HierarchyPointNode<any>): void {
    switch ((root.data as OrganizationalTreeNode).type) {
      case OrganizationalTreeNodeType.LEGAL_ENTITY:
        root.y = this.getDefaultY(OrganizationalTreeNodeType.LEGAL_ENTITY) - this.getDefaultY(this.currentCenterType);
        break;
      case OrganizationalTreeNodeType.LOCATION:
        root.y = this.getDefaultY(OrganizationalTreeNodeType.LOCATION) - this.getDefaultY(this.currentCenterType);
        break;
      case OrganizationalTreeNodeType.DIVISION:
        root.y = this.getDefaultY(OrganizationalTreeNodeType.DIVISION) - this.getDefaultY(this.currentCenterType);
        break;
      case OrganizationalTreeNodeType.DEPARTMENT:
        root.y = this.getDefaultY(OrganizationalTreeNodeType.DEPARTMENT) - this.getDefaultY(this.currentCenterType);
        break;
      case OrganizationalTreeNodeType.GROUP:
        root.y = this.getDefaultY(OrganizationalTreeNodeType.GROUP) - this.getDefaultY(this.currentCenterType);
        break;
      case OrganizationalTreeNodeType.EMPLOYEE:
        root.y = this.getDefaultY(OrganizationalTreeNodeType.EMPLOYEE) - this.getDefaultY(this.currentCenterType);
        break;
      case OrganizationalTreeNodeType.PROJECT:
        root.y = this.getDefaultY(OrganizationalTreeNodeType.PROJECT) - this.getDefaultY(this.currentCenterType);
        break;
    }

    if (root.children?.length) {
      root.children?.forEach((value) => {
        this.correctDepth(value);
      })
    }
  }

  private getDefaultY(type: OrganizationalTreeNodeType) {
    const isCenterChanged = this.mainTree != this.treeData;
    const multiplier = isCenterChanged ? 0.5 : 1;
    switch (type) {
      case OrganizationalTreeNodeType.LEGAL_ENTITY:
        return 0;
      case OrganizationalTreeNodeType.LOCATION:
        return this.radius * multiplier;
      case OrganizationalTreeNodeType.DIVISION:
        return this.radius * 2 * multiplier;
      case OrganizationalTreeNodeType.DEPARTMENT:
        return this.radius * 3 * multiplier;
      case OrganizationalTreeNodeType.GROUP:
        return this.radius * 4 * multiplier;
      case OrganizationalTreeNodeType.EMPLOYEE:
        return this.radius * 5 * multiplier;
      case OrganizationalTreeNodeType.PROJECT:
        return 0;
    }
  }

  private redrawTreeLinks(root: d3.HierarchyPointNode<any>): void {
    const straight = d => {
      const offset = 90 * Math.PI / 180; // 90 градусов в радианах
      const sourceAngle = d.source.x - offset;
      const sourceRadius = d.source.y;
      const sourceX = sourceRadius * Math.cos(sourceAngle);
      const sourceY = sourceRadius * Math.sin(sourceAngle);
      const targetAngle = d.target.x - offset;
      const targetRadius = d.target.y;
      const targetX = targetRadius * Math.cos(targetAngle);
      const targetY = targetRadius * Math.sin(targetAngle);
      return "M" + sourceX + " " + sourceY + " "
        + "L" + targetX + " " + targetY
    };

    const u = this.graph?.selectAll(".link")
      .data(root.links());
    u
      ?.exit()
      .transition()
      .duration(this.redrawAnimationDurationInMs)
      .style("opacity", 0)
      .remove();
    u
      ?.join("path")
      .merge(u)
      .transition()
      .duration(this.redrawAnimationDurationInMs)
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .attr("d", straight);
  }

  private redrawTreeNodes(root: d3.HierarchyPointNode<any>): void {
    const nodeRadius = 6;
    const u = this.graph?.selectAll(".node")
      .data(root.descendants());
    u
      ?.exit()
      .transition()
      .duration(this.redrawAnimationDurationInMs)
      .style("opacity", 0)
      .remove();
    u
      ?.join("circle")
      .merge(u)
      .attr("class", d => {
        const classList: string[] = ["node"];
        if (d.data.type === OrganizationalTreeNodeType.EMPLOYEE) {
          classList.push("employee-node");
          if (d.data.isVacancy) {
            classList.push("vacancy-node")
          }
          if (d.data.id == this.selectedEmployee()?.id) {
            classList.push("selected-employee-node");
          }
        }
        return classList.join(" ");
      })
      .attr("id", d => {
        if (d.data.type === OrganizationalTreeNodeType.EMPLOYEE || d.data.type === OrganizationalTreeNodeType.LOCATION) {
          return `${OrganizationalTreeNodeType[d.data.type]}-${d.data.id}`;
        }
        return `UNIT-${d.data.id}`;
      })
      .on("click", (evt) => {
        const elementId: string = evt["target"].id;
        const splitted = elementId.split("-");
        const type = OrganizationalTreeNodeType[splitted[0]];
        const id: number = Number.parseInt(splitted[1]);
        if (type !== OrganizationalTreeNodeType.LOCATION) {
          if (type === OrganizationalTreeNodeType.EMPLOYEE) {
            this.onEmployeeSelect(id);
          } else {
            const currentDate: Date = new Date();
            if (currentDate.getTime() - this.lastClickedDate.getTime() < 200) {
              this.expand$.next();
            } else {
              this.lastClickedDate = currentDate;
              timer(200)
                .pipe(
                  takeUntil(this.expand$)
                )
                .subscribe(() => {
                  this.onUnitSelect(id);
                });
            }
          }
        }
      })
      .on('dblclick', (event) => {
        event.stopPropagation(); // убираем зум на двойной клик по ноде
        const elementId: string = event["target"].id;
        const split: string[] = elementId.split("-");
        const type: string = split[0];

        if (type === 'UNIT') {
          const id: number = Number.parseInt(split[1]);
          this.updateTreeFromUnitId(id);
        }
      })
      .transition()
      .duration(this.redrawAnimationDurationInMs)
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
      .attr("fill", d => {
        if (d.data.id === this.selectedEmployee()?.id || d.data.id === this.selectedUnit()?.id) {
          return "#555";
        }
        return d.data.isVacancy ? "#88ff50" : "#999";
      })
      .attr("r", nodeRadius);
  }

  private redrawTreeLabels(root: d3.HierarchyPointNode<any>): void {
    const u = this.graph?.selectAll(".label")
      .data(root.descendants());
    u
      ?.exit()
      .transition()
      .duration(this.redrawAnimationDurationInMs)
      .style("opacity", 0)
      .remove();
    u
      ?.join("text")
      .merge(u)
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
      .attr("dy", d => {
        if (d.data.type === OrganizationalTreeNodeType.EMPLOYEE || d.data.type === OrganizationalTreeNodeType.LEGAL_ENTITY) {
          return "0.3em";
        } else {
          return "-0.3em";
        }
      })
      .attr("x", d => d.x < Math.PI === !d.children ? 8 : -8)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("paint-order", "stroke")
      .attr("class", "label")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("style", "width: 100%; height: auto; font: 12px inter;")
      .text(d => d.data.name);

    // const headImages = this.graph?.selectAll(".node")
    //   .filter((d: any) => d.data.head)
    //   .data(root.descendants());
    // console.log(headImages);
    //
    // headImages
    //   ?.exit()
    //   .transition()
    //   .duration(this.redrawAnimationDurationInMs)
    //   .style("opacity", 0)
    //   .remove();
    // headImages
    //   ?.join("image")
    //   .merge(headImages)
    //   .attr("xlink:href", d => {
    //     return d.data.head ?
    //       `http://45.95.234.130${d.data.head.imageUrl}` : "http://45.95.234.130/content/images/profile/default_profile_image.png";
    //   })
    //   .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
    //   .attr("dy", "1em")
    //   .attr("x", d => d.x < Math.PI === !d.children ? 8 : -8)
    //   .attr("clip-path", "inset(0% round 15px)")
    //   .attr("width", "10px")
    //   .attr("height", "10px");

    const headLabels = this.graph?.selectAll(".node-head-label")
      .filter((d: any) => d.data.head)
      .data(root.descendants());

    headLabels
      ?.join("text")
      .merge(headLabels)
      .attr("class", "node-head-label")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
      .attr("dy", "1em")
      .attr("x", d => d.x < Math.PI === !d.children ? 8 : -8)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("paint-order", "stroke")
      .attr("class", "label")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("style", "width: 100%; height: auto; font: 10px inter; fill: #999999;")
      .text(d => d.data.head?.name);
  }

  updateSettings(filterSettings: FilterMenuSettings): void {
    this.filterSettings = filterSettings;
    const selectedUnitsIds = [
      ...filterSettings.selectedDivisionsIds(),
      ...filterSettings.selectedDepartmentsIds(),
      ...filterSettings.selectedGroupsIds()
    ];
    if (selectedUnitsIds.length == 0) {
      // если нет фильтров, считаем по корню
      selectedUnitsIds.push(1)
    }
    this.selectedUnits.next(selectedUnitsIds);
    this.redrawTree();
  }

  findEmployeeOnTreeById(employeeId: number): void {
    this.employeeService.findById(employeeId)
      .pipe(
        tap(employee => {
          this.selectedEmployee.set(employee);
          this.selectedUnit.set(undefined);
          this.selectedType.set('employee');
        }),
        map(employee => employee.organizationalUnit?.id),
        concatMap(unitId => this.organizationalUnitService.findUnitHierarchy(unitId!))
      )
      .subscribe(hierarchy => {
        this.selectedEmployee()!.organizationalUnitHierarchy = hierarchy;
        const idsToExpand: number[] = this.findNotExpandedHierarchyUnitIds(hierarchy);
        const zoomToEmployee = () => this.zoomToNodeWithId(`EMPLOYEE-` + employeeId);
        if (idsToExpand.length !== 0) {
          this.expandUnits(idsToExpand, zoomToEmployee);
        } else {
          zoomToEmployee();
        }
      });
  }

  redrawTreeByProject(projectId: number): void {
    this.projectService.findById(projectId)
      .subscribe((project: Project) => {
        this.treeData = convertProject(project);
        this.redrawTree();
      });

    return;
  }

  findUnitOnTreeById([unitId, setCenter]: [unitId: number, setCenter: boolean]): void {
    if (setCenter) {
      this.organizationalUnitService.findById(unitId)
        .subscribe((unit: OrganizationalUnit) => {
          this.treeData = convertUnit(this.treeData!, unit);
          this.redrawTree();
        });

      return;
    }
    const zoomToUnit = () => this.zoomToNodeWithId(`UNIT-` + unitId);
    if (this.isOrganizationalUnitExpanded(this.treeData!, unitId)) {
      zoomToUnit();
    }
    this.organizationalUnitService.findUnitHierarchy(unitId)
      .subscribe(hierarchy => {
        const idsToExpand: number[] = this.findNotExpandedHierarchyUnitIds(hierarchy);
        this.expandUnits(idsToExpand, zoomToUnit);
      });
  }

  backToMainTree(): void {
    this.treeData = this.mainTree;
    this.redrawTree();
  }

  private zoomToNodeWithId(id: string): void {
    const node = d3.select("#" + id).data()[0];
    if (node) {
      const offset = 90 * Math.PI / 180; // 90 градусов в радианах
      const sourceAngle = node["x"] - offset;
      const sourceRadius = node["y"];
      const sourceX = sourceRadius * Math.cos(sourceAngle);
      const sourceY = sourceRadius * Math.sin(sourceAngle);
      const transform = d3.zoomIdentity
        .scale(1.5)
        .translate(-sourceX, -sourceY);
      this.svg!
        .transition()
        .duration(1500)
        .call(this.zoom!.transform, transform);
    }
  }

  private findNotExpandedHierarchyUnitIds(hierarchy: OrganizationalUnitHierarchy): number[] {
    const idsToExpand: number[] = [];
    if (hierarchy.legalEntity && !this.isOrganizationalUnitExpanded(this.treeData!, hierarchy.legalEntity.id)) {
      idsToExpand.push(hierarchy.legalEntity.id);
    }
    if (hierarchy.division && !this.isOrganizationalUnitExpanded(this.treeData!, hierarchy.division.id)) {
      idsToExpand.push(hierarchy.division.id);
    }
    if (hierarchy.department && !this.isOrganizationalUnitExpanded(this.treeData!, hierarchy.department.id)) {
      idsToExpand.push(hierarchy.department.id);
    }
    if (hierarchy.group && !this.isOrganizationalUnitExpanded(this.treeData!, hierarchy.group.id)) {
      idsToExpand.push(hierarchy.group.id);
    }
    return idsToExpand;
  }

  private isOrganizationalUnitExpanded(root: OrganizationalTreeNode, id: number) {
    if (root.type !== OrganizationalTreeNodeType.EMPLOYEE && root.type !== OrganizationalTreeNodeType.LOCATION) {
      if (root.id === id && root.children) {
        return true;
      }
    }
    if (!root.children) {
      return false;
    }
    let isExpanded = false;
    for (const child of root.children) {
      if (this.isOrganizationalUnitExpanded(child, id)) {
        isExpanded = true;
        break;
      }
    }
    return isExpanded;
  }

  private onEmployeeSelect(id: number): void {
    this.employeeService.findById(id)
      .pipe(
        tap(employee => {
          this.selectedEmployee.set(employee);
          this.selectedUnit.set(undefined);
          this.selectedType.set('employee');
        }),
        map(employee => employee.organizationalUnit?.id),
        concatMap(id => this.organizationalUnitService.findUnitHierarchy(id!))
      )
      .subscribe(hierarchy => {
        this.selectedEmployee()!.organizationalUnitHierarchy = hierarchy;
        this.redrawTree();
      });
  }

  private onUnitSelect(id: number): void {
    this.organizationalUnitService.findById(id)
      .pipe(
        tap(unit => {
          this.selectedUnit.set(unit);
          this.selectedEmployee.set(undefined);
          this.selectedType.set('unit');
        }),
        concatMap(() => this.organizationalUnitService.findUnitHierarchy(id))
      )
      .subscribe(hierarchy => {
        this.selectedUnit()!.hierarchy = hierarchy;
        this.redrawTree();
      })
  }

  private updateTreeFromUnitId(id: number): void {
    if (this.selectedUnitsIds.has(id)) {
      this.selectedUnitsIds.delete(id);
      this.collapseUnit(this.treeData!, id);
      this.redrawTree();
    } else {
      this.selectedUnitsIds.add(id);
      this.expandUnits([id]);
    }
  }

  private expandUnits(ids: number[], actionAfterExpanding?: () => void): void {
    forkJoin(ids.map(id => this.organizationalUnitService.findById(id)))
      .subscribe(units => {
        units.forEach(unit => {
          const convertedUnit = convertUnit(this.treeData!, unit);
          this.updateUnitInTree(this.treeData!, convertedUnit);
        });
        this.redrawTree();
        if (actionAfterExpanding !== undefined) {
          actionAfterExpanding();
        }
      });
  }

  private updateUnitInTree(root: OrganizationalTreeNode, unit: OrganizationalTreeNode): boolean {
    if (!root.children) {
      return false;
    }
    for (let i = 0; i < root.children.length; i++) {
      if (root.children[i].id === unit.id) {
        root.children[i] = unit;
        return true;
      }
    }
    for (let i = 0; i < root.children.length; i++) {
      const isAppended = this.updateUnitInTree(root.children[i], unit);
      if (isAppended) {
        return true;
      }
    }
    return false;
  }

  private collapseUnit(root: OrganizationalTreeNode, unitId: number): boolean {
    if (!root.children) {
      return false;
    }
    for (let i = 0; i < root.children.length; i++) {
      if (root.children[i].id == unitId) {
        if (root.children[i].children != undefined) {
          root.children[i].children!.length = 0;
        }
        return true;
      }
    }
    for (let i = 0; i < root.children.length; i++) {
      const isCollapsed = this.collapseUnit(root.children[i], unitId);
      if (isCollapsed) {
        return true;
      }
    }
    return false;
  }

  private filterTreeDataFromSettings(treeData: OrganizationalTreeNode): OrganizationalTreeNode {
    if (!this.filterSettings || !this.filterChain) {
      return treeData;
    }
    let data: OrganizationalTreeNode = JSON.parse(JSON.stringify(treeData));
    if (!data.children) {
      return data;
    }
    data.children = data.children.filter(node => this.filterChain!.isValid(node, this.filterSettings!));
    for (let i = 0; i < data.children.length; i++) {
      data.children[i] = this.filterTreeDataFromSettings(data.children[i]);
    }
    return data;
  }

}