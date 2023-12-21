import { Component, OnInit } from '@angular/core';
import { OrganizationalUnitService } from '../../service/organizational-unit.service';
import { EmployeeService } from '../../service/employee.service';
import * as d3 from 'd3';
import { OrganizationalUnit } from '../../model/organizational-unit.model';
import { EmployeeInfoComponent } from '../employee-info/employee-info.component';
import { Employee } from '../../model/employee.model';
import { FilterMenuComponent } from '../filter-menu/filter-menu.component';
import { FilterMenuSettings } from '../filter-menu/filter-menu-settings.model';
import { OrganizationalTreeNode } from './organizational-tree-node.model';
import { OrganizationalTreeNodeType } from './organizational-tree-node-type.enum';
import { OrganizationalUnitType } from '../../model/organizational-unit-type.enum';
import { LocationService } from '../../service/location.service';
import { CommonModule } from '@angular/common';
import { TreeSearchBarComponent } from '../search-bar/tree-search-bar.component';
import { concat, concatMap, forkJoin, map, pipe, tap } from 'rxjs';
import { OrganizationalUnitHierarchy } from '../../model/organizational-unit-hierarchy.model';
import { WithUnitTypeNamePipe } from '../../pipe/with-unit-type-name.pipe';

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
  private svg?: d3.Selection<any, any, any, any>
  private graph?: d3.Selection<any, any, any, any>
  private zoom?: d3.ZoomBehavior<any, any>;
  private selectedUnitsIds: Set<number> = new Set();
  private filterSettings?: FilterMenuSettings;
  selectedEmployee?: Employee;
  locationNames?: string[];

  private width = 1200;
  private height = this.width;
  private cx = this.width * 0.5;
  private cy = this.height * 0.495;
  private radius = Math.min(this.width, this.height) / 2 - 350;

  constructor(private organizationalUnitService: OrganizationalUnitService,
    private employeeService: EmployeeService, private locationService: LocationService,
    private withUnitTypeNamePipe: WithUnitTypeNamePipe) { }

  ngOnInit(): void {
    this.initTree();
  }

  private initTree(): void {
    this.organizationalUnitService.findByTypeGroupedByLocation(OrganizationalUnitType.LEGAL_ENTITY).subscribe(data => {
      this.createSvg();
      this.treeData = this.convertUnitGroupedByLocations(data[0]); // на текущем этапе у нас только одно юр. лицо
      this.redrawTree();
    });
    this.locationService.findAll().subscribe(data => {
      this.locationNames = data.map(location => location.name);
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
    const filteredData: OrganizationalTreeNode = this.filterTreeDataFromSettings(this.treeData, this.filterSettings);
    const hierarchy = d3.hierarchy(filteredData)
      .sort((a, b) => d3.ascending(a.data.name, b.data.name));
    const tree = d3.tree()
      .size([2 * Math.PI, this.radius * hierarchy.height])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
    const root = tree(<any>hierarchy);

    this.redrawTreeLinks(root);
    this.redrawTreeNodes(root);
    this.redrawTreeLabels(root);
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

    this.graph?.selectAll(".link").remove();
    this.graph?.selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .attr("d", straight);
  }

  private redrawTreeNodes(root: d3.HierarchyPointNode<any>): void {
    const nodeRadius = 6;
    this.graph?.selectAll(".node").remove();
    this.graph?.selectAll(".node")
      .data(root.descendants())
      .join("circle")
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
        const elementId: string = evt.target.id;
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
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
      .attr("fill", d => {
        if (d.children) {
          return "#555";
        }
        return d.data.isVacancy ? "#88ff50" : "#999";
      })
      .attr("r", nodeRadius);
    this.graph?.select(".selected-employee-node")
      .join("circle")
      .attr("r", nodeRadius)
      .attr("stroke", "#353535")
      .attr("stroke-width", 2);
  }

  private redrawTreeLabels(root: d3.HierarchyPointNode<any>): void {
    this.graph?.selectAll(".label").remove();
    this.graph?.selectAll(".label")
      .data(root.descendants())
      .join("text")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("paint-order", "stroke")
      .attr("stroke", "white")
      .attr("fill", "currentColor")
      .attr("class", "label")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .text(d => d.data.name);
  }

  private filterTreeDataFromSettings(treeData: OrganizationalTreeNode, filterSettings?: FilterMenuSettings): OrganizationalTreeNode {
    if (!filterSettings) {
      return treeData;
    }
    let data: OrganizationalTreeNode = JSON.parse(JSON.stringify(treeData));
    if (!data.children) {
      return data;
    }
    data.children = data.children.filter(node => {
      if (node.type === OrganizationalTreeNodeType.LOCATION && !filterSettings.locations[node.name]) {
        return false;
      } else {
        if (node.location && !filterSettings.locations[node.location]) {
          return false;
        }
      }
      if (node.type === OrganizationalTreeNodeType.EMPLOYEE) {
        if (filterSettings.displayNotVacancies && filterSettings.displayVacancies) {
          return true;
        } else if (filterSettings.displayNotVacancies) {
          return !node.isVacancy;
        } else if (filterSettings.displayVacancies) {
          return node.isVacancy;
        } else {
          return false;
        }
      }
      return true;
    });
    for (let i = 0; i < data.children.length; i++) {
      data.children[i] = this.filterTreeDataFromSettings(data.children[i], filterSettings);
    }
    return data;
  }

  findEmployeeOnTreeById(employeeId: number): void {
    this.employeeService.findById(employeeId).pipe(
      tap(employee => this.selectedEmployee = employee),
      map(employee => employee.organizationalUnit?.id),
      concatMap(unitId => this.organizationalUnitService.findUnitHierarchy(unitId!))
    ).subscribe(hierarchy => {
      this.selectedEmployee!.organizationalUnitHierarchy = hierarchy;
      const idsToExpand: number[] = this.findNotExpandedHierarchyUnitIds(hierarchy);
      this.expandUnits(idsToExpand, () => this.zoomToNodeWithId(`EMPLOYEE-` + employeeId));
    });
  }

  findUnitOnTreeById(unitId: number): void {
    if (this.isOrganizationalUnitExpanded(this.treeData!, unitId)) {
      return;
    }
    this.organizationalUnitService.findUnitHierarchy(unitId).subscribe(hierarchy => {
      const idsToExpand: number[] = this.findNotExpandedHierarchyUnitIds(hierarchy);
      this.expandUnits(idsToExpand, () => this.zoomToNodeWithId(`UNIT-` + unitId));
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
        .duration(2000)
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
          const convertedUnit = this.convertUnit(unit);
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

  private convertUnitGroupedByLocations(organizationalUnit: OrganizationalUnit): OrganizationalTreeNode {
    const node: OrganizationalTreeNode = {
      id: organizationalUnit.id,
      name: this.withUnitTypeNamePipe.transform(organizationalUnit),
      type: OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]],
      children: []
    };
    organizationalUnit.locations?.forEach(location => {
      const locationChild: OrganizationalTreeNode = {
        id: location.id,
        name: location.name,
        type: OrganizationalTreeNodeType.LOCATION,
        children: []
      };
      location.subsidiaries?.forEach(subsidiary => {
        const newSubsidiary: OrganizationalTreeNode = {
          id: subsidiary.id,
          name: this.withUnitTypeNamePipe.transform(subsidiary),
          type: OrganizationalTreeNodeType[OrganizationalUnitType[subsidiary.type]],
          location: subsidiary.location
        };
        locationChild.children?.push(newSubsidiary);
      });
      node.children?.push(locationChild);
    });
    return node;
  }

  private convertUnit(organizationalUnit: OrganizationalUnit): OrganizationalTreeNode {
    const node: OrganizationalTreeNode = {
      id: organizationalUnit.id,
      name: this.withUnitTypeNamePipe.transform(organizationalUnit),
      type: OrganizationalTreeNodeType[OrganizationalUnitType[organizationalUnit.type]],
      children: []
    };
    organizationalUnit.subsidiaries?.forEach(subsidiary => {
      const newSubsidiary: OrganizationalTreeNode = {
        id: subsidiary.id,
        name: this.withUnitTypeNamePipe.transform(subsidiary),
        type: OrganizationalTreeNodeType[OrganizationalUnitType[subsidiary.type]]
      };
      node.children?.push(newSubsidiary);
    });
    organizationalUnit.employees?.forEach(employee => {
      const newEmployee: OrganizationalTreeNode = {
        id: employee.id,
        name: employee.fullName,
        type: OrganizationalTreeNodeType.EMPLOYEE,
        isVacancy: employee.isVacancy
      };
      node.children?.push(newEmployee);
    });
    return node;
  }

}
