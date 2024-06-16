import { AsyncPipe, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WithUnitTypeNamePipe } from '../../pipe/with-unit-type-name.pipe';

@Component({
  selector: 'unit-search-bar',
  standalone: true,
  imports: [NgFor, WithUnitTypeNamePipe, AsyncPipe],
  templateUrl: './unit-search-bar.component.html',
  styleUrl: './unit-search-bar.component.css'
})
export class UnitNamesSearchBarComponent {

  @Input()
  unitNames!: string[];
  searchedUnitNames: string[] = this.unitNames;

  @Output()
  unitNameSelectedEvent = new EventEmitter<string>();

  constructor() { }

  searchUnitNames(input: EventTarget) {
    const inputValue: string = (<HTMLInputElement>input).value;
    this.searchedUnitNames =
      this.unitNames.filter(value => !!inputValue && value.toLowerCase().includes(inputValue.toLowerCase()));
  }

  selectUnitName(name: string) {
    this.unitNameSelectedEvent.emit(name);
  }
  
}
