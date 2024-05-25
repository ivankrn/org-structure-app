import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { Observable, Subscription, debounceTime, distinctUntilChanged, fromEvent, map, of, switchMap, tap } from 'rxjs';
import { Employee } from '../../model/employee.model';
import { EmployeeService } from '../../service/employee.service';
import { OrganizationalUnit } from '../../model/organizational-unit.model';
import { OrganizationalUnitService } from '../../service/organizational-unit.service';
import { WithUnitTypeNamePipe } from '../../pipe/with-unit-type-name.pipe';
import { ProjectService } from '../../service/project.service';
import { Project } from '../../model/project.model';

@Component({
    selector: 'tree-search-bar',
    standalone: true,
    providers: [EmployeeService, OrganizationalUnitService, ProjectService, WithUnitTypeNamePipe],
    templateUrl: './tree-search-bar.component.html',
    styleUrl: './tree-search-bar.component.css',
    imports: [CommonModule, WithUnitTypeNamePipe]
})
export class TreeSearchBarComponent implements AfterViewInit {

  @ViewChild('searchBarInput')
  searchBarInput?: ElementRef;
  setCenter: boolean = false;
  showCenterCheckBox: boolean = true;
  showSearches: boolean = false;
  isSearching: boolean = false;

  employees: Employee[] = [];
  searchedEmployees: Employee[] = [];
  projects: Project[] = [];
  searchedProjects: Project[] = [];
  organizationalUnits: OrganizationalUnit[] = [];
  searchedOrganizationalUnits: OrganizationalUnit[] = [];

  isSearchEmployees: boolean = true;
  isSearchProjects: boolean = false;
  isSearchUnits: boolean = false;

  @Output()
  selectedEmployeeEvent = new EventEmitter<number>();
  @Output()
  selectedProjectEvent = new EventEmitter<number>();
  @Output()
  selectedUnitEvent = new EventEmitter<[number, boolean]>();
  @Output()
  backToMainEvent = new EventEmitter<void>();
  searchSubscription?: Subscription;

  private employeeService: EmployeeService = inject(EmployeeService);
  private projectService: ProjectService = inject(ProjectService);
  private organizationalUnitService: OrganizationalUnitService = inject(OrganizationalUnitService);

  ngAfterViewInit(): void {
    this.initSearch();
  }

  private initSearch(): void {
    this.searchSubscription?.unsubscribe();
    const search = fromEvent(this.searchBarInput?.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.isSearching = true),
        switchMap((term) => {
          if (term) {
            if (this.isSearchEmployees) {
              return this.getEmployees(term);
            }

            if (this.isSearchProjects) {
              return this.getProjects(term);
            }

            return this.getUnits(term);
          }

          if (this.isSearchEmployees) {
            of<any>(this.employees)
          }

          if (this.isSearchProjects) {
            of<any>(this.projects)
          }

          return of<any>(this.organizationalUnits);
        }),
        tap(() => {
          this.isSearching = false;
          this.showSearches = true;
        })
      );

    this.searchSubscription = search.subscribe(data => {
      this.isSearching = false;
      if (this.isSearchEmployees) {
        this.searchedEmployees = data;
      } else if (this.isSearchProjects) {
        this.searchedProjects = data;
      } else {
        this.searchedOrganizationalUnits = data;
      }
    })
  }

  setSearch(name: string) {
    this.isSearchEmployees = false;
    this.isSearchProjects = false;
    this.isSearchUnits = false;
    switch (name) {
      case 'searchEmployees':
        this.isSearchEmployees = true;
        break;
      case 'searchProjects':
        this.isSearchProjects = true;
        break;
      case 'searchUnits':
        this.isSearchUnits = true;
        break;
    }
    this.initSearch();
  }

  selectEmployee(employee: Employee): void {
    this.selectedEmployeeEvent.emit(employee.id);
    this.searchBarInput!.nativeElement.value = employee.fullName;
    this.showSearches = false;
  }

  selectProject(project: Project): void {
    this.selectedProjectEvent.emit(project.id);
    this.searchBarInput!.nativeElement.value = project.name;
    this.showSearches = false;
  }

  selectUnit(unit: OrganizationalUnit): void {
    this.selectedUnitEvent.emit([unit.id, this.setCenter]);
    this.searchBarInput!.nativeElement.value = unit.name;
    this.showSearches = false;
    this.showCenterCheckBox = !this.setCenter;
  }

  backToMainTree(): void {
    this.backToMainEvent.emit();
    this.setCenter = false;
    this.showCenterCheckBox = true;
  }

  private getEmployees(name: string): Observable<Employee[]> {
    return this.employeeService.findByName(name);
  }

  private getUnits(name: string): Observable<OrganizationalUnit[]> {
    return this.organizationalUnitService.findByName(name);
  }

  private getProjects(name: string): Observable<Project[]> {
    return this.projectService.findByName(name);
  }

}
