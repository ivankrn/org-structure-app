import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { concatMap, forkJoin, map, tap } from 'rxjs';
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
import { OrganizationalTreeNodeType } from './organizational-tree-node-type.enum';
import { OrganizationalTreeNode } from './organizational-tree-node.model';
import { filterTreeDataFromSettings } from './util/filter-tree-data';
import { convertUnit, convertUnitGroupedByLocations } from './util/organizational-tree-util';

@Component({
  selector: 'app-organizational-tree',
  standalone: true,
  imports: [CommonModule, EmployeeInfoComponent, FilterMenuComponent, TreeSearchBarComponent],
  providers: [OrganizationalUnitService, EmployeeService, LocationService, WithUnitTypeNamePipe],
  templateUrl: './organizational-tree.component.html',
  styleUrl: './organizational-tree.component.css'
})
export class OrganizationalTreeComponent implements OnInit {

  private treeData?: OrganizationalTreeNode;
  private svg?: d3.Selection<any, any, any, any>;
  private graph?: d3.Selection<any, any, any, any>;
  private zoom?: d3.ZoomBehavior<any, any>;
  private selectedUnitsIds: Set<number> = new Set();
  private filterSettings?: FilterMenuSettings;
  selectedEmployee?: Employee;
  locationNames?: string[];
  divisionNames?: string[];
  departmentNames?: string[];
  groupNames?: string[];

  private width = 1200;
  private height = 1200;
  private cx = this.width * 0.5;
  private cy = this.height * 0.495;
  private radius = Math.min(this.width, this.height) / 2 - 350;
  private redrawAnimationDurationInMs = 250;

  constructor(private organizationalUnitService: OrganizationalUnitService,
    private employeeService: EmployeeService, private locationService: LocationService) { }

  ngOnInit(): void {
    this.initTree();
  }

  private initTree(): void {
    this.organizationalUnitService.findByTypeGroupedByLocation(OrganizationalUnitType.LEGAL_ENTITY).subscribe(data => {
      this.createSvg();
      this.treeData = convertUnitGroupedByLocations(data[0]); // на текущем этапе у нас только одно юр. лицо
      this.redrawTree();
    });
    this.locationService.findAll().subscribe(data => {
      this.locationNames = data.map(location => location.name);
    });
    this.organizationalUnitService.findNamesByTypes().subscribe(data => {
      this.divisionNames = data[OrganizationalUnitType.DIVISION];
      this.departmentNames = data[OrganizationalUnitType.DEPARTMENT];
      this.groupNames = data[OrganizationalUnitType.GROUP];
    });
  }

  updateSettings(filterSettings: FilterMenuSettings): void {
    this.filterSettings = filterSettings;
    this.redrawTree();
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
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [-this.cx - delta / 2, -this.cy + delta / 2, this.width + delta, this.height + delta])
      .attr("style", "width: 100%; height: auto; font: 10px inter;")
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
    const filteredData: OrganizationalTreeNode = filterTreeDataFromSettings(this.treeData, this.filterSettings);
    const hierarchy = d3.hierarchy(filteredData)
      .sort((a, b) => d3.ascending(a.data.name, b.data.name));
    const tree = d3.tree()
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
        root.y = 0;
        break;
      case OrganizationalTreeNodeType.LOCATION:
        root.y = this.radius;
        break;
      case OrganizationalTreeNodeType.DIVISION:
        root.y = this.radius * 2;
        break;
      case OrganizationalTreeNodeType.DEPARTMENT:
        root.y = this.radius * 3;
        break;
      case OrganizationalTreeNodeType.GROUP:
        root.y = this.radius * 4;
        break;
      case OrganizationalTreeNodeType.EMPLOYEE:
        root.y = this.radius * 5;
        break;
    }

    if (root.children?.length) {
      root.children?.forEach((value) => {
        this.correctDepth(value);
      })
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
          if (d.data.id == this.selectedEmployee?.id) {
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
            this.updateTreeFromUnitId(id);
          }
        }
      })
      .transition()
      .duration(this.redrawAnimationDurationInMs)
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
      .attr("fill", d => {
        if (d.children) {
          return "#555";
        }
        return d.data.isVacancy ? "#88ff50" : "#999";
      })
      .attr("r", nodeRadius)
      .attr("stroke", d => {
        return d.data.type === OrganizationalTreeNodeType.EMPLOYEE && d.data.id == this.selectedEmployee?.id ? "#353535" : null;
      })
      .attr("stroke-width", 2);
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
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("paint-order", "stroke")
      .attr("class", "label")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .text(d => d.data.name);
  }

  findEmployeeOnTreeById(employeeId: number): void {
    this.employeeService.findById(employeeId).pipe(
      tap(employee => this.selectedEmployee = employee),
      map(employee => employee.organizationalUnit?.id),
      concatMap(unitId => this.organizationalUnitService.findUnitHierarchy(unitId!))
    ).subscribe(hierarchy => {
      this.selectedEmployee!.organizationalUnitHierarchy = hierarchy;
      const idsToExpand: number[] = this.findNotExpandedHierarchyUnitIds(hierarchy);
      const zoomToEmployee = () => this.zoomToNodeWithId(`EMPLOYEE-` + employeeId);
      if (idsToExpand.length !== 0) {
        this.expandUnits(idsToExpand, zoomToEmployee);
      } else {
        zoomToEmployee();
      }
    });
  }

  findUnitOnTreeById(unitId: number): void {
    const zoomToUnit = () => this.zoomToNodeWithId(`UNIT-` + unitId);
    if (this.isOrganizationalUnitExpanded(this.treeData!, unitId)) {
      zoomToUnit();
    }
    this.organizationalUnitService.findUnitHierarchy(unitId).subscribe(hierarchy => {
      const idsToExpand: number[] = this.findNotExpandedHierarchyUnitIds(hierarchy);
      this.expandUnits(idsToExpand, zoomToUnit);
    });
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
    this.employeeService.findById(id).pipe(
      tap(employee => this.selectedEmployee = employee),
      map(employee => employee.organizationalUnit?.id),
      concatMap(id => this.organizationalUnitService.findUnitHierarchy(id!))
    ).subscribe(hierarchy => {
      this.selectedEmployee!.organizationalUnitHierarchy = hierarchy;
      this.redrawTree();
    });
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

}