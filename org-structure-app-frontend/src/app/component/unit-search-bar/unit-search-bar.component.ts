import { NgClass, NgStyle } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrganizationalUnit } from '../../model/organizational-unit.model';

@Component({
  selector: 'unit-search-bar',
  standalone: true,
  imports: [NgClass, NgStyle, FormsModule],
  templateUrl: './unit-search-bar.component.html',
  styleUrl: './unit-search-bar.component.css'
})
export class UnitSearchBarComponent implements OnInit {
  
  @Input()
  units!: OrganizationalUnit[];
  @Input()
  clearSubject: Subject<void>;
  @Output()
  unitSelectedEvent = new EventEmitter<OrganizationalUnit>();

  selectedUnitsArray: OrganizationalUnit[] = [];
  selectedUnitNamesString: string = '';
  selectOpened: boolean = false;

  searchSubscription?: Subscription;
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

  selectUnit(unit: OrganizationalUnit) {
    const alreadyContains = this.selectedUnitsArray.filter(u => u.id === unit.id).length > 0;
    if (alreadyContains) {
      this.selectedUnitsArray = this.selectedUnitsArray.filter(u => u.id !== unit.id);
    } else {
      this.selectedUnitsArray.push(unit);
    }
    this.selectedUnitNamesString = this.selectedUnitsArray.map(u => u.name).join(', ');
    this.unitSelectedEvent.emit(unit);
  }

  protected readonly Math = Math;
}