import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocationService } from '../../service/location.service';
import { FilterMenuSettings } from './filter-menu-settings.model';

@Component({
  selector: 'filter-menu',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [LocationService],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.css'
})
export class FilterMenuComponent implements OnInit, OnDestroy {

  @Input()
  set locationNames(value: string[]) {
    value.forEach(location => this.addLocation(location));
  }

  settingsForm = this.formBuilder.group({
    locations: this.formBuilder.group({}),
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

  private addLocation(location: string) {
    this.locations.addControl(location, this.formBuilder.control(true));
  }

}
