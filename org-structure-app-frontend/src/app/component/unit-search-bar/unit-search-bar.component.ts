import { NgClass, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent, map, of, Subject, Subscription, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrganizationalUnit } from '../../model/organizational-unit.model';

@Component({
  selector: 'unit-search-bar',
  standalone: true,
  imports: [NgClass, NgStyle, FormsModule],
  templateUrl: './unit-search-bar.component.html',
  styleUrl: './unit-search-bar.component.css'
})
export class UnitSearchBarComponent implements OnInit, AfterViewInit {
  
  @ViewChild('searchBarInput')
  searchBarInput?: ElementRef;
  @Input()
  units!: OrganizationalUnit[];
  @Input()
  clearSubject: Subject<void>;
  @Output()
  unitSelectedEvent = new EventEmitter<OrganizationalUnit>();

  searchedUnits: OrganizationalUnit[] = [];
  selectedUnitsArray: OrganizationalUnit[] = [];
  selectedUnitNamesString: string = '';
  selectOpened: boolean = false;
  showSearches: boolean = false;

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

  ngAfterViewInit(): void {
    this.initSearch();
  }

  private initSearch(): void {
    this.searchSubscription?.unsubscribe();
    this.showSearches = false;
    this.searchedUnits = Object.assign([], this.units);
    const search = fromEvent(this.searchBarInput?.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term) {
            return of(this.filterUnits(term));
          }

          return of<any>(this.units);
        }),
        tap(() => {
          this.showSearches = true;
        })
      );

    this.searchSubscription = search
      .subscribe(data => {
        this.searchedUnits = data;
      });

    /** фикс бага, когда при нажатии на крестик не закрывался список предложений поиска */
    fromEvent(this.searchBarInput?.nativeElement, 'search')
        .subscribe(() => this.showSearches = false);
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

  private filterUnits(searchedName: string): OrganizationalUnit[] {
    return this.units.filter((unit) => unit.name.toLowerCase().includes(searchedName.toLowerCase()));
  }

  protected readonly Math = Math;
}