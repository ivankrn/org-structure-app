import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { LocationService } from '../../service/location.service';
import { FilterMenuSettings } from './filter-menu-settings.model';
import { UnitNamesSearchBarComponent } from '../unit-search-bar/unit-search-bar.component';

@Component({
  selector: 'filter-menu',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, UnitNamesSearchBarComponent],
  providers: [LocationService],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.css'
})
export class FilterMenuComponent implements OnInit, OnDestroy {

  _locationNames!: string[];
  @Input()
  set locationNames(value: string[]) {
    this._locationNames = value;
    value.forEach(name => this.locations.addControl(name, this.formBuilder.control(false)));
  }
  selectedLocationNames: string[] = [];
  hasLocationsFilter: boolean = false;
  clearLocationsFilter: Subject<void> = new Subject<void>();

  _divisionNames!: string[];
  @Input()
  set divisionNames(value: string[]) {
    this._divisionNames = value;
    value.forEach(name => this.divisions.addControl(name, this.formBuilder.control(false)));
  }
  selectedDivisionNames: string[] = [];
  hasDivisionsFilter: boolean = false;
  clearDivisionsFilter: Subject<void> = new Subject<void>();

  _departmentNames!: string[];
  @Input()
  set departmentNames(value: string[]) {
    this._departmentNames = value;
    value.forEach(name => this.departments.addControl(name, this.formBuilder.control(false)));
  }
  selectedDepartmentNames: string[] = [];
  hasDepartmentsFilter: boolean = false;
  clearDepartmentsFilter: Subject<void> = new Subject<void>();

  _groupNames!: string[];
  @Input()
  set groupNames(value: string[]) {
    this._groupNames = value;
    value.forEach(name => this.groups.addControl(name, this.formBuilder.control(false)));
  }
  selectedGroupNames: string[] = [];
  hasGroupsFilter: boolean = false;
  clearGroupsFilter: Subject<void> = new Subject<void>();

  _jobTitles!: string[];
  @Input()
  set jobTitles(value: string[]) {
    this._jobTitles = value;
    // @ts-ignore
    value.forEach(name => this.jobTitles.addControl(name, this.formBuilder.control(false)));
  }
  selectedJobTitles: string[] = [];
  hasJobTitlesFilter: boolean = false;
  clearJobTitlesFilter: Subject<void> = new Subject<void>();

  _jobTypes!: string[];
  @Input()
  set jobTypes(value: string[]) {
    this._jobTypes = value;
    // @ts-ignore
    value.forEach(name => this.jobTypes.addControl(name, this.formBuilder.control(false)));
  }
  selectedJobTypes: string[] = [];
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

  selectLocationName(name: string): void {
    const isChecked = this.locations.controls[name]?.value;
    this.locations.controls[name]?.patchValue(!isChecked);
    if (this.selectedLocationNames.includes(name)) {
      this.selectedLocationNames = this.selectedLocationNames.filter(n => n !== name);
    } else {
      this.selectedLocationNames.push(name);
    }
    this.hasLocationsFilter = !!this.selectedLocationNames.length;
  }

  clearLocations(): void {
    this.selectedLocationNames = [];
    this.hasLocationsFilter = false;
    this.clearLocationsFilter.next();
    this._locationNames.forEach((name: string) => {
      const isChecked = this.locations.controls[name]?.value;
      if (isChecked) {
        this.locations.controls[name]?.patchValue(false);
      }
    });
  }

  selectDivisionName(name: string): void {
    const isChecked = this.divisions.get(name)?.value;
    this.divisions.get(name)?.patchValue(!isChecked);
    if (this.selectedDivisionNames.includes(name)) {
      this.selectedDivisionNames = this.selectedDivisionNames.filter(n => n !== name);
    } else {
      this.selectedDivisionNames.push(name);
    }
    this.hasDivisionsFilter = !!this.selectedDivisionNames.length;
  }

  clearDivisions(): void {
    this.selectedDivisionNames = [];
    this.hasDivisionsFilter = false;
    this.clearDivisionsFilter.next();
    this._divisionNames.forEach((name: string) => {
      const isChecked = this.divisions.controls[name]?.value;
      if (isChecked) {
        this.divisions.controls[name]?.patchValue(false);
      }
    });
  }

  selectDepartmentName(name: string): void {
    const isChecked = this.departments.get(name)?.value;
    this.departments.get(name)?.patchValue(!isChecked);
    if (this.selectedDepartmentNames.includes(name)) {
      this.selectedDepartmentNames = this.selectedDepartmentNames.filter(n => n !== name);
    } else {
      this.selectedDepartmentNames.push(name);
    }
    this.hasDepartmentsFilter = !!this.selectedDepartmentNames.length;
  }

  cleardepartments(): void {
    this.selectedDepartmentNames = [];
    this.hasDepartmentsFilter = false;
    this.clearDepartmentsFilter.next();
    this._departmentNames.forEach((name: string) => {
      const isChecked = this.departments.controls[name]?.value;
      if (isChecked) {
        this.departments.controls[name]?.patchValue(false);
      }
    });
  }

  selectGroupName(name: string): void {
    const isChecked = this.groups.get(name)?.value;
    this.groups.get(name)?.patchValue(!isChecked);
    if (this.selectedGroupNames.includes(name)) {
      this.selectedGroupNames = this.selectedGroupNames.filter(n => n !== name);
    } else {
      this.selectedGroupNames.push(name);
    }
    this.hasGroupsFilter = !!this.selectedGroupNames.length;
  }

  clearGroups(): void {
    this.selectedGroupNames = [];
    this.hasGroupsFilter = false;
    this.clearGroupsFilter.next();
    this._groupNames.forEach((name: string) => {
      const isChecked = this.groups.controls[name]?.value;
      if (isChecked) {
        this.groups.controls[name]?.patchValue(false);
      }
    });
  }

  selectJobTitle(name: string): void {
    // @ts-ignore
    const isChecked = this.jobTitles.get(name)?.value;
    // @ts-ignore
    this.jobTitles.get(name)?.patchValue(!isChecked);
    if (this.selectedJobTitles.includes(name)) {
      this.selectedJobTitles = this.selectedJobTitles.filter(n => n !== name);
    } else {
      this.selectedJobTitles.push(name);
    }
    this.hasJobTitlesFilter = !!this.selectedJobTitles.length;
  }

  clearJobTitles(): void {
    this.selectedJobTitles = [];
    this.hasJobTitlesFilter = false;
    this.clearJobTitlesFilter.next();
    this._jobTitles.forEach((name: string) => {
      // @ts-ignore
      const isChecked = this.jobTitles.controls[name]?.value;
      if (isChecked) {
        // @ts-ignore
        this.jobTitles.controls[name]?.patchValue(false);
      }
    });
  }

  selectJobType(name: string): void {
    // @ts-ignore
    const isChecked = this.jobTypes.get(name)?.value;
    // @ts-ignore
    this.jobTypes.get(name)?.patchValue(!isChecked);
    if (this.selectedJobTypes.includes(name)) {
      this.selectedJobTypes = this.selectedJobTypes.filter(n => n !== name);
    } else {
      this.selectedJobTypes.push(name);
    }
    this.hasJobTypesFilter = !!this.selectedJobTypes.length;
  }

  clearJobTypes(): void {
    this.selectedJobTypes = [];
    this.hasJobTypesFilter = false;
    this.clearJobTypesFilter.next();
    this._jobTypes.forEach((name: string) => {
      // @ts-ignore
      const isChecked = this.jobTypes.controls[name]?.value;
      if (isChecked) {
        // @ts-ignore
        this.jobTypes.controls[name]?.patchValue(false);
      }
    });
  }
}
