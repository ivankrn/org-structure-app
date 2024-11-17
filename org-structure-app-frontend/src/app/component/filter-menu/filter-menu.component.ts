import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { FilterMenuSettings } from './filter-menu-settings.model';
import { UnitSearchBarComponent } from '../unit-search-bar/unit-search-bar.component';
import { OrganizationalUnit } from '../../model/organizational-unit.model';
import { NamesSearchBarComponent } from "../name-search-bar/name-search-bar.component";

@Component({
  selector: 'filter-menu',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, UnitSearchBarComponent, NamesSearchBarComponent],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.css'
})
export class FilterMenuComponent implements OnInit, OnDestroy {

  _locationNames!: string[];
  @Input()
  set locationNames(value: string[]) {
    this._locationNames = value;
    value.forEach(name => this.locationsFormGroup.addControl(name, this.formBuilder.control(false)));
  }
  selectedLocationNames: string[] = [];
  hasLocationsFilter: boolean = false;
  clearLocationsFilter: Subject<void> = new Subject<void>();

  _divisions!: OrganizationalUnit[];
  @Input()
  set divisions(value: OrganizationalUnit[]) {
    this._divisions = value;
    value.forEach(u => this.divisionsFormGroup.addControl(u.id.toString(), this.formBuilder.control(false)));
  }
  selectedDivisionIds: number[] = [];
  hasDivisionsFilter: boolean = false;
  clearDivisionsFilter: Subject<void> = new Subject<void>();

  _departments!: OrganizationalUnit[];
  @Input()
  set departments(value: OrganizationalUnit[]) {
    this._departments = value;
    value.forEach(u => this.departmentsFormGroup.addControl(u.id.toString(), this.formBuilder.control(false)));
  }
  selectedDepartmentIds: number[] = [];
  hasDepartmentsFilter: boolean = false;
  clearDepartmentsFilter: Subject<void> = new Subject<void>();

  _groups!: OrganizationalUnit[];
  @Input()
  set groups(value: OrganizationalUnit[]) {
    this._groups = value;
    value.forEach(u => this.groupsFormGroup.addControl(u.id.toString(), this.formBuilder.control(false)));
  }
  selectedGroupIds: number[] = [];
  hasGroupsFilter: boolean = false;
  clearGroupsFilter: Subject<void> = new Subject<void>();

  _jobTitles!: string[];
  @Input()
  set jobTitles(value: string[]) {
    this._jobTitles = value;
    // @ts-ignore
    value.forEach(name => this.jobTitlesFormGroup.addControl(name, this.formBuilder.control(false)));
  }
  selectedJobTitles: string[] = [];
  hasJobTitlesFilter: boolean = false;
  clearJobTitlesFilter: Subject<void> = new Subject<void>();

  _jobTypes!: string[];
  @Input()
  set jobTypes(value: string[]) {
    this._jobTypes = value;
    // @ts-ignore
    value.forEach(name => this.jobTypesFormGroup.addControl(name, this.formBuilder.control(false)));
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
    const filterSettings: FilterMenuSettings = Object.assign(new FilterMenuSettings(), this.settingsForm.value);
    this.newSettingsEvent.emit(filterSettings);
  }

  get locationsFormGroup() {
    return this.settingsForm.get("locations") as FormGroup;
  }

  get divisionsFormGroup() {
    return this.settingsForm.get("divisions") as FormGroup;
  }

  get departmentsFormGroup() {
    return this.settingsForm.get("departments") as FormGroup;
  }

  get groupsFormGroup() {
    return this.settingsForm.get("groups") as FormGroup;
  }

  get jobTitlesFormGroup() {
    // @ts-ignore
    return this.settingsForm.get("jobTitles") as FormGroup;
  }

  get jobTypesFormGroup() {
    // @ts-ignore
    return this.settingsForm.get("jobTypes") as FormGroup;
  }

  selectLocationName(name: string): void {
    const isChecked = this.locationsFormGroup.controls[name]?.value;
    this.locationsFormGroup.controls[name]?.patchValue(!isChecked);
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
      const isChecked = this.locationsFormGroup.controls[name]?.value;
      if (isChecked) {
        this.locationsFormGroup.controls[name]?.patchValue(false);
      }
    });
  }

  selectDivision(unit: OrganizationalUnit): void {
    const isChecked = this.divisionsFormGroup.get(unit.id.toString())?.value;
    this.divisionsFormGroup.get(unit.id.toString())?.patchValue(!isChecked);
    if (this.selectedDivisionIds.includes(unit.id)) {
      this.selectedDivisionIds = this.selectedDivisionIds.filter(n => n !== unit.id);
    } else {
      this.selectedDivisionIds.push(unit.id);
    }
    this.hasDivisionsFilter = !!this.selectedDivisionIds.length;
  }

  clearDivisions(): void {
    this.selectedDivisionIds = [];
    this.hasDivisionsFilter = false;
    this.clearDivisionsFilter.next();
    Object.keys(this.divisionsFormGroup.controls).forEach((name: string) => {
      const isChecked = this.divisionsFormGroup.controls[name]?.value;
      if (isChecked) {
        this.divisionsFormGroup.controls[name]?.patchValue(false);
      }
    });
  }

  selectDepartment(unit: OrganizationalUnit): void {
    const isChecked = this.departmentsFormGroup.get(unit.id.toString())?.value;
    this.departmentsFormGroup.get(unit.id.toString())?.patchValue(!isChecked);
    if (this.selectedDepartmentIds.includes(unit.id)) {
      this.selectedDepartmentIds = this.selectedDepartmentIds.filter(n => n !== unit.id);
    } else {
      this.selectedDepartmentIds.push(unit.id);
    }
    this.hasDepartmentsFilter = !!this.selectedDepartmentIds.length;
  }

  clearDepartments(): void {
    this.selectedDepartmentIds = [];
    this.hasDepartmentsFilter = false;
    this.clearDepartmentsFilter.next();
    Object.keys(this.departmentsFormGroup.controls).forEach((name: string) => {
      const isChecked = this.departmentsFormGroup.controls[name]?.value;
      if (isChecked) {
        this.departmentsFormGroup.controls[name]?.patchValue(false);
      }
    });
  }

  selectGroup(unit: OrganizationalUnit): void {
    const isChecked = this.groupsFormGroup.get(unit.id.toString())?.value;
    this.groupsFormGroup.get(unit.id.toString())?.patchValue(!isChecked);
    if (this.selectedGroupIds.includes(unit.id)) {
      this.selectedGroupIds = this.selectedGroupIds.filter(n => n !== unit.id);
    } else {
      this.selectedGroupIds.push(unit.id);
    }
    this.hasGroupsFilter = !!this.selectedGroupIds.length;
  }

  clearGroups(): void {
    this.selectedGroupIds = [];
    this.hasGroupsFilter = false;
    this.clearGroupsFilter.next();
    Object.keys(this.groupsFormGroup.controls).forEach((name: string) => {
      const isChecked = this.groupsFormGroup.controls[name]?.value;
      if (isChecked) {
        this.groupsFormGroup.controls[name]?.patchValue(false);
      }
    });
  }

  selectJobTitle(name: string): void {
    // @ts-ignore
    const isChecked = this.jobTitlesFormGroup.get(name)?.value;
    // @ts-ignore
    this.jobTitlesFormGroup.get(name)?.patchValue(!isChecked);
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
      const isChecked = this.jobTitlesFormGroup.controls[name]?.value;
      if (isChecked) {
        // @ts-ignore
        this.jobTitlesFormGroup.controls[name]?.patchValue(false);
      }
    });
  }

  selectJobType(name: string): void {
    // @ts-ignore
    const isChecked = this.jobTypesFormGroup.get(name)?.value;
    // @ts-ignore
    this.jobTypesFormGroup.get(name)?.patchValue(!isChecked);
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
      const isChecked = this.jobTypesFormGroup.controls[name]?.value;
      if (isChecked) {
        // @ts-ignore
        this.jobTypesFormGroup.controls[name]?.patchValue(false);
      }
    });
  }

}
