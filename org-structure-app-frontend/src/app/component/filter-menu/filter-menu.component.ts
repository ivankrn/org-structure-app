import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocationService } from '../../service/location.service';
import { FilterMenuSettings } from './filter-menu-settings.model';
import { UnitNamesSearchBarComponent } from '../unit-search-bar/unit-search-bar.component';
import { OrganizationalUnitType } from '../../model/organizational-unit-type.enum';

@Component({
  selector: 'filter-menu',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, UnitNamesSearchBarComponent],
  providers: [LocationService],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.css'
})
export class FilterMenuComponent implements OnInit, OnDestroy {

  @Input()
  set locationNames(value: string[]) {
    value.forEach(name => (<FormGroup>this.settingsForm.get("locations")).addControl(name, this.formBuilder.control(true)));
  }

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

  settingsForm = this.formBuilder.group({
    locations: this.formBuilder.group({}),
    divisions: this.formBuilder.group({}),
    departments: this.formBuilder.group({}),
    groups: this.formBuilder.group({}),
    displayVacancies: true,
    displayNotVacancies: true
  });

  @Output()
  newSettingsEvent = new EventEmitter<FilterMenuSettings>();
  unitTypes = OrganizationalUnitType;

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
}
