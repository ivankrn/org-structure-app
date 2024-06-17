import { AsyncPipe, NgClass, NgFor, NgStyle } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { WithUnitTypeNamePipe } from '../../pipe/with-unit-type-name.pipe';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'unit-search-bar',
  standalone: true,
  imports: [NgFor, NgClass, NgStyle, WithUnitTypeNamePipe, AsyncPipe, FormsModule],
  templateUrl: './unit-search-bar.component.html',
  styleUrl: './unit-search-bar.component.css'
})
export class UnitNamesSearchBarComponent implements OnInit {

  @Input()
  unitNames!: string[];

  @Input()
  clearSubject: Subject<void>;

  selectedUnitNamesArray: string[] = [];
  selectedUnitNamesString: string = '';
  selectOpened: boolean = false;

  @Output()
  unitNameSelectedEvent = new EventEmitter<string>();

  destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.clearSubject
        ?.pipe(
            takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          this.selectedUnitNamesArray = [];
          this.selectedUnitNamesString = '';
        });
  }

  selectUnitName(name: string) {
    if (this.selectedUnitNamesArray.includes(name)) {
      this.selectedUnitNamesArray = this.selectedUnitNamesArray.filter(n => n !== name);
    } else {
      this.selectedUnitNamesArray.push(name);
    }
    this.selectedUnitNamesString = this.selectedUnitNamesArray.join(', ');
    this.unitNameSelectedEvent.emit(name);
  }

  protected readonly Math = Math;
}