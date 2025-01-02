import { NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent, map, of, Subject, Subscription, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'name-search-bar',
  standalone: true,
  imports: [NgClass, NgStyle, FormsModule],
  templateUrl: './name-search-bar.component.html',
  styleUrl: './name-search-bar.component.css'
})
export class NamesSearchBarComponent implements OnInit, AfterViewInit {

  @ViewChild('searchBarInput')
  searchBarInput?: ElementRef;
  @Input()
  names!: string[];

  @Input()
  clearSubject: Subject<void>;

  searchedNames: string[] = [];
  selectedNamesArray: string[] = [];
  selectedNamesString: string = '';
  selectOpened: boolean = false;
  showSearches: boolean = false;

  @Output()
  nameSelectedEvent = new EventEmitter<string>();

  searchSubscription?: Subscription;

  destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.clearSubject
        ?.pipe(
            takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          this.selectedNamesArray = [];
          this.selectedNamesString = '';
        });
  }

  ngAfterViewInit(): void {
    this.initSearch();
  }

  private initSearch(): void {
    this.searchSubscription?.unsubscribe();
    this.showSearches = false;
    this.searchedNames = Object.assign([], this.names);
    const search = fromEvent(this.searchBarInput?.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term) {
            return of(this.filterNames(term));
          }

          return of<any>(this.names);
        }),
        tap(() => {
          this.showSearches = true;
        })
      );

    this.searchSubscription = search
      .subscribe(data => {
        this.searchedNames = data;
      });

    /** фикс бага, когда при нажатии на крестик не закрывался список предложений поиска */
    fromEvent(this.searchBarInput?.nativeElement, 'search')
        .subscribe(() => this.showSearches = false);
  }

  selectName(name: string) {
    if (this.selectedNamesArray.includes(name)) {
      this.selectedNamesArray = this.selectedNamesArray.filter(n => n !== name);
    } else {
      this.selectedNamesArray.push(name);
    }
    this.selectedNamesString = this.selectedNamesArray.join(', ');
    this.nameSelectedEvent.emit(name);
  }

  private filterNames(searchedName: string): string[] {
    return this.names.filter((name) => name.toLowerCase().includes(searchedName.toLowerCase()));
  }

  protected readonly Math = Math;
}