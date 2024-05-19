import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Observable, Subscription, debounceTime, distinctUntilChanged, fromEvent, map, of, switchMap, tap } from 'rxjs';
import { Employee } from '../../model/employee.model';
import { EmployeeService } from '../../service/employee.service';
import { OrganizationalUnit } from '../../model/organizational-unit.model';
import { OrganizationalUnitService } from '../../service/organizational-unit.service';
import { WithUnitTypeNamePipe } from '../../pipe/with-unit-type-name.pipe';

@Component({
    selector: 'tree-search-bar',
    standalone: true,
    providers: [EmployeeService, OrganizationalUnitService, WithUnitTypeNamePipe],
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
  organizationalUnits: OrganizationalUnit[] = [];
  searchedOrganizationalUnits: OrganizationalUnit[] = [];

  isSearchEmployees: boolean = true;
  isSearchProjects: boolean = false;
  isSearchUnits: boolean = false;

  @Output()
  selectedEmployeeEvent = new EventEmitter<number>();
  @Output()
  selectedUnitEvent = new EventEmitter<[number, boolean]>();
  @Output()
  backToMainEvent = new EventEmitter<void>();
  searchSubscription?: Subscription;

  constructor(private employeeService: EmployeeService, private organizationalUnitService: OrganizationalUnitService) { }

  ngAfterViewInit(): void {
    this.initSearch();
  }

  private initSearch(): void {
    this.searchSubscription?.unsubscribe();
    const search = fromEvent(this.searchBarInput?.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.isSearching = true),
      switchMap((term) => {
        if (term) {
          return this.isSearchEmployees ? this.getEmployees(term) : this.getUnits(term);
        }
        return this.isSearchEmployees ? of<any>(this.employees) : of<any>(this.organizationalUnits);
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

  selectUnit(unit: OrganizationalUnit): void {
    this.selectedUnitEvent.emit([unit.id, this.setCenter]);
    this.searchBarInput!.nativeElement.value = unit.name;
    this.showSearches = false;
    this.showCenterCheckBox = false;
  }

  backToMainTree(): void {
    this.backToMainEvent.emit();
    this.showCenterCheckBox = false;
  }

  private getEmployees(name: string): Observable<Employee[]> {
    return this.employeeService.findByName(name);
  }

  private getUnits(name: string): Observable<OrganizationalUnit[]> {
    return this.organizationalUnitService.findByName(name);
  }

  trackById(index: number, item: Employee | OrganizationalUnit): number {
    return item.id;
  }

}
