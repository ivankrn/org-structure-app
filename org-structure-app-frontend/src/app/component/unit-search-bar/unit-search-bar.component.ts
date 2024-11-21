import { AsyncPipe, NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { WithUnitTypeNamePipe } from '../../pipe/with-unit-type-name.pipe';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FilterItem } from '../../model/filter-item.model';

@Component({
  selector: 'unit-search-bar',
  standalone: true,
  imports: [NgFor, NgClass, NgStyle, WithUnitTypeNamePipe, AsyncPipe, FormsModule],
  templateUrl: './unit-search-bar.component.html',
  styleUrl: './unit-search-bar.component.css'
})
export class UnitNamesSearchBarComponent implements OnInit {

  @Input()
  units!: FilterItem[];

  @Input()
  clearSubject: Subject<void>;

  selectedUnitsArray: FilterItem[] = [];
  selectedUnitNamesString: string = '';
  selectOpened: boolean = false;

  @Output()
  unitNameSelectedEvent = new EventEmitter<FilterItem>();

  destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.clearSubject
        ?.pipe(
            takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          this.selectedUnitsArray = [];
          this.selectedUnitNamesString = '';
        });
  }

  selectUnit(item: FilterItem) {
    if (this.selectedUnitsArray.includes(item)) {
      this.selectedUnitsArray = this.selectedUnitsArray.filter(n => n.id !== item.id);
    } else {
      this.selectedUnitsArray.push(item);
    }
    this.selectedUnitNamesString = this.selectedUnitsArray.map((unit: FilterItem) => unit.name).join(', ');
    this.unitNameSelectedEvent.emit(item);
  }

  protected readonly Math = Math;
}