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

  @ViewChild("searchBarInput")
  searchBarInput?: ElementRef;
  showSearches: boolean = false;
  isSearching: boolean = false;

  employees: Employee[] = [];
  searchedEmployees: Employee[] = [];
  organizationalUnits: OrganizationalUnit[] = [];
  searchedOrganizationalUnits: OrganizationalUnit[] = [];

  searchUnits: boolean = false;

  @Output()
  selectedEmployeeEvent = new EventEmitter<number>();
  @Output()
  selectedUnitEvent = new EventEmitter<number>();
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
          return this.searchUnits ? this.getUnits(term) : this.getEmployees(term);
        }
        return this.searchUnits ? of<any>(this.organizationalUnits) : of<any>(this.employees);
      }),
      tap(() => {
        this.isSearching = false;
        this.showSearches = true;
      })
    );

    this.searchSubscription = search.subscribe(data => {
      this.isSearching = false;
      if (this.searchUnits) {
        this.searchedOrganizationalUnits = data;
      } else {
        this.searchedEmployees = data;
      }
    })
  }

  setSearchUnits(search: boolean) {
    this.searchUnits = search;
    this.initSearch();
  }

  selectEmployee(employee: Employee): void {
    this.selectedEmployeeEvent.emit(employee.id);
    this.searchBarInput!.nativeElement.value = employee.fullName;
    this.showSearches = false;
  }

  selectUnit(unit: OrganizationalUnit): void {
    this.selectedUnitEvent.emit(unit.id);
    this.searchBarInput!.nativeElement.value = unit.name;
    this.showSearches = false;
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
