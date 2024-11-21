import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { LocationService } from '../../service/location.service';
import { FilterMenuSettings } from './filter-menu-settings.model';
import { UnitNamesSearchBarComponent } from '../unit-search-bar/unit-search-bar.component';
import { FilterItem } from '../../model/filter-item.model';

@Component({
  selector: 'filter-menu',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, UnitNamesSearchBarComponent],
  providers: [LocationService],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.css'
})
export class FilterMenuComponent implements OnInit, OnDestroy {

  _locationNames!: FilterItem[];
  @Input()
  set locationNames(value: FilterItem[]) {
    this._locationNames = value;
    /** костыль для фильтра внутренних структур локаций */
    value.forEach(unit => this.locations.addControl(unit.id.toString() + '_' + unit.name, this.formBuilder.control(false)));
  }
  selectedLocationNames: FilterItem[] = [];
  hasLocationsFilter: boolean = false;
  clearLocationsFilter: Subject<void> = new Subject<void>();

  _divisionNames!: FilterItem[];
  @Input()
  set divisionNames(value: FilterItem[]) {
    this._divisionNames = value;
    value.forEach(unit => this.divisions.addControl(unit.id.toString(), this.formBuilder.control(false)));
  }
  selectedDivisionNames: FilterItem[] = [];
  hasDivisionsFilter: boolean = false;
  clearDivisionsFilter: Subject<void> = new Subject<void>();

  _departmentNames!: FilterItem[];
  @Input()
  set departmentNames(value: FilterItem[]) {
    this._departmentNames = value;
    value.forEach(unit => this.departments.addControl(unit.id.toString(), this.formBuilder.control(false)));
  }
  selectedDepartmentNames: FilterItem[] = [];
  hasDepartmentsFilter: boolean = false;
  clearDepartmentsFilter: Subject<void> = new Subject<void>();

  _groupNames!: FilterItem[];
  @Input()
  set groupNames(value: FilterItem[]) {
    this._groupNames = value;
    value.forEach(unit => this.groups.addControl(unit.id.toString(), this.formBuilder.control(false)));
  }
  selectedGroupNames: FilterItem[] = [];
  hasGroupsFilter: boolean = false;
  clearGroupsFilter: Subject<void> = new Subject<void>();

  _jobTitles!: FilterItem[];
  @Input()
  set jobTitles(value: FilterItem[]) {
    this._jobTitles = value;
    // @ts-ignore
    value.forEach(title => this.jobTitles.addControl(title.id.toString(), this.formBuilder.control(false)));
  }
  selectedJobTitles: FilterItem[] = [];
  hasJobTitlesFilter: boolean = false;
  clearJobTitlesFilter: Subject<void> = new Subject<void>();

  _jobTypes!: FilterItem[];
  @Input()
  set jobTypes(value: FilterItem[]) {
    this._jobTypes = value;
    // @ts-ignore
    value.forEach(type => this.jobTypes.addControl(type.id.toString(), this.formBuilder.control(false)));
  }
  selectedJobTypes: FilterItem[] = [];
  hasJobTypesFilter: boolean = false;
  clearJobTypesFilter: Subject<void> = new Subject<void>();

  settingsForm = this.formBuilder.group({
    locations: this.formBuilder.group({}),
    divisions: this.formBuilder.group({}),
    departments: this.formBuilder.group({}),
    groups: this.formBuilder.group({}),
    jobTitles: this.formBuilder.group({}),
    jobTypes: this.formBuilder.group({}),
    displayVacancies: true,
    displayNotVacancies: true
  });

  @Output()
  newSettingsEvent = new EventEmitter<FilterMenuSettings>();

  private settingsUpdateSubscription?: Subscription;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.settingsUpdateSubscription = this.settingsForm.valueChanges.subscribe(() => this.updateSettings());
  }

  ngOnDestroy(): void {
    this.settingsUpdateSubscription?.unsubscribe();
  }

  updateSettings() {
    this.newSettingsEvent.emit(<FilterMenuSettings>this.settingsForm.value);
  }

  get locations() {
    return this.settingsForm.get("locations") as FormGroup;
  }

  get divisions() {
    return this.settingsForm.get("divisions") as FormGroup;
  }

  get departments() {
    return this.settingsForm.get("departments") as FormGroup;
  }

  get groups() {
    return this.settingsForm.get("groups") as FormGroup;
  }

  get jobTitles() {
    // @ts-ignore
    return this.settingsForm.get("jobTitles") as FormGroup;
  }

  get jobTypes() {
    // @ts-ignore
    return this.settingsForm.get("jobTypes") as FormGroup;
  }

  selectLocationName(location: FilterItem): void {
    const isChecked = this.locations.controls[location.id.toString() + '_' + location.name]?.value;
    this.locations.controls[location.id.toString() + '_' + location.name]?.patchValue(!isChecked);
    if (this.selectedLocationNames.includes(location)) {
      this.selectedLocationNames = this.selectedLocationNames.filter(n => n.id !== location.id);
    } else {
      this.selectedLocationNames.push(location);
    }
    this.hasLocationsFilter = !!this.selectedLocationNames.length;
  }

  clearLocations(): void {
    this.selectedLocationNames = [];
    this.hasLocationsFilter = false;
    this.clearLocationsFilter.next();
    this._locationNames.forEach((location: FilterItem) => {
      const isChecked = this.locations.controls[location.id.toString()  + '_' + location.name]?.value;
      if (isChecked) {
        this.locations.controls[location.id.toString()  + '_' + location.name]?.patchValue(false);
      }
    });
  }

  selectDivisionName(division: FilterItem): void {
    const isChecked = this.divisions.get(division.id.toString())?.value;
    this.divisions.get(division.id.toString())?.patchValue(!isChecked);
    if (this.selectedDivisionNames.includes(division)) {
      this.selectedDivisionNames = this.selectedDivisionNames.filter(n => n.id !== division.id);
    } else {
      this.selectedDivisionNames.push(division);
    }
    this.hasDivisionsFilter = !!this.selectedDivisionNames.length;
  }

  clearDivisions(): void {
    this.selectedDivisionNames = [];
    this.hasDivisionsFilter = false;
    this.clearDivisionsFilter.next();
    this._divisionNames.forEach((division: FilterItem) => {
      const isChecked = this.divisions.controls[division.id.toString()]?.value;
      if (isChecked) {
        this.divisions.controls[division.id.toString()]?.patchValue(false);
      }
    });
  }

  selectDepartmentName(department: FilterItem): void {
    const isChecked = this.departments.get(department.id.toString())?.value;
    this.departments.get(department.id.toString())?.patchValue(!isChecked);
    if (this.selectedDepartmentNames.includes(department)) {
      this.selectedDepartmentNames = this.selectedDepartmentNames.filter(n => n.id !== department.id);
    } else {
      this.selectedDepartmentNames.push(department);
    }
    this.hasDepartmentsFilter = !!this.selectedDepartmentNames.length;
  }

  clearDepartments(): void {
    this.selectedDepartmentNames = [];
    this.hasDepartmentsFilter = false;
    this.clearDepartmentsFilter.next();
    this._departmentNames.forEach((department: FilterItem) => {
      const isChecked = this.departments.controls[department.id.toString()]?.value;
      if (isChecked) {
        this.departments.controls[department.id.toString()]?.patchValue(false);
      }
    });
  }

  selectGroupName(group: FilterItem): void {
    const isChecked = this.groups.get(group.id.toString())?.value;
    this.groups.get(group.id.toString())?.patchValue(!isChecked);
    if (this.selectedGroupNames.includes(group)) {
      this.selectedGroupNames = this.selectedGroupNames.filter(n => n.id !== group.id);
    } else {
      this.selectedGroupNames.push(group);
    }
    this.hasGroupsFilter = !!this.selectedGroupNames.length;
  }

  clearGroups(): void {
    this.selectedGroupNames = [];
    this.hasGroupsFilter = false;
    this.clearGroupsFilter.next();
    this._groupNames.forEach((group: FilterItem) => {
      const isChecked = this.groups.controls[group.id.toString()]?.value;
      if (isChecked) {
        this.groups.controls[group.id.toString()]?.patchValue(false);
      }
    });
  }

  selectJobTitle(title: FilterItem): void {
    // @ts-ignore
    const isChecked = this.jobTitles.get(title.id.toString())?.value;
    // @ts-ignore
    this.jobTitles.get(title.id.toString())?.patchValue(!isChecked);
    if (this.selectedJobTitles.includes(title)) {
      this.selectedJobTitles = this.selectedJobTitles.filter(n => n.id !== title.id);
    } else {
      this.selectedJobTitles.push(title);
    }
    this.hasJobTitlesFilter = !!this.selectedJobTitles.length;
  }

  clearJobTitles(): void {
    this.selectedJobTitles = [];
    this.hasJobTitlesFilter = false;
    this.clearJobTitlesFilter.next();
    this._jobTitles.forEach((title: FilterItem) => {
      // @ts-ignore
      const isChecked = this.jobTitles.controls[title.id.toString()]?.value;
      if (isChecked) {
        // @ts-ignore
        this.jobTitles.controls[title.id.toString()]?.patchValue(false);
      }
    });
  }

  selectJobType(type: FilterItem): void {
    // @ts-ignore
    const isChecked = this.jobTypes.get(type.id.toString())?.value;
    // @ts-ignore
    this.jobTypes.get(type.id.toString())?.patchValue(!isChecked);
    if (this.selectedJobTypes.includes(type)) {
      this.selectedJobTypes = this.selectedJobTypes.filter(n => n.id !== type.id);
    } else {
      this.selectedJobTypes.push(type);
    }
    this.hasJobTypesFilter = !!this.selectedJobTypes.length;
  }

  clearJobTypes(): void {
    this.selectedJobTypes = [];
    this.hasJobTypesFilter = false;
    this.clearJobTypesFilter.next();
    this._jobTypes.forEach((type: FilterItem) => {
      // @ts-ignore
      const isChecked = this.jobTypes.controls[type.id.toString()]?.value;
      if (isChecked) {
        // @ts-ignore
        this.jobTypes.controls[type.id.toString()]?.patchValue(false);
      }
    });
  }
}
