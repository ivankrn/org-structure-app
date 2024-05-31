import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
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
    value.forEach(name => this.locations.addControl(name, this.formBuilder.control(true)));
    this.selectedLocationNames = value;
  }
  selectedLocationNames: string[] = [];

  _divisionNames!: string[];
  @Input()
  set divisionNames(value: string[]) {
    this._divisionNames = value;
    value.forEach(name => this.divisions.addControl(name, this.formBuilder.control(false)));
  }
  selectedDivisionNames: string[] = [];

  _departmentNames!: string[];
  @Input()
  set departmentNames(value: string[]) {
    this._departmentNames = value;
    value.forEach(name => this.departments.addControl(name, this.formBuilder.control(false)));
  }
  selectedDepartmentNames: string[] = [];

  _groupNames!: string[];
  @Input()
  set groupNames(value: string[]) {
    this._groupNames = value;
    value.forEach(name => this.groups.addControl(name, this.formBuilder.control(false)));
  }
  selectedGroupNames: string[] = [];

  _jobTitles!: string[];
  @Input()
  set jobTitles(value: string[]) {
    this._jobTitles = value;
    // @ts-ignore
    value.forEach(name => this.jobTitles.addControl(name, this.formBuilder.control(false)));
  }
  selectedJobTitles: string[] = [];

  _jobTypes!: string[];
  @Input()
  set jobTypes(value: string[]) {
    this._jobTypes = value;
    // @ts-ignore
    value.forEach(name => this.jobTypes.addControl(name, this.formBuilder.control(false)));
  }
  selectedJobTypes: string[] = [];

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
    const isChecked = this.locations.get(name)?.value;
    this.locations.get(name)?.patchValue(!isChecked);
    if (this.selectedLocationNames.includes(name)) {
      this.selectedLocationNames = this.selectedLocationNames.filter(n => n !== name);
    } else {
      this.selectedLocationNames.push(name);
    }
  }

  selectDivisionName(name: string): void {
    const isChecked = this.divisions.get(name)?.value;
    this.divisions.get(name)?.patchValue(!isChecked);
    if (this.selectedDivisionNames.includes(name)) {
      this.selectedDivisionNames = this.selectedDivisionNames.filter(n => n !== name);
    } else {
      this.selectedDivisionNames.push(name);
    }
  }

  selectDepartmentName(name: string): void {
    const isChecked = this.departments.get(name)?.value;
    this.departments.get(name)?.patchValue(!isChecked);
    if (this.selectedDepartmentNames.includes(name)) {
      this.selectedDepartmentNames = this.selectedDepartmentNames.filter(n => n !== name);
    } else {
      this.selectedDepartmentNames.push(name);
    }
  }

  selectGroupName(name: string): void {
    const isChecked = this.groups.get(name)?.value;
    this.groups.get(name)?.patchValue(!isChecked);
    if (this.selectedGroupNames.includes(name)) {
      this.selectedGroupNames = this.selectedGroupNames.filter(n => n !== name);
    } else {
      this.selectedGroupNames.push(name);
    }
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
  }
}
