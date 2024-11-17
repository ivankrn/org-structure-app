import { NgClass, NgStyle } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'name-search-bar',
  standalone: true,
  imports: [NgClass, NgStyle, FormsModule],
  templateUrl: './name-search-bar.component.html',
  styleUrl: './name-search-bar.component.css'
})
export class NamesSearchBarComponent implements OnInit {

  @Input()
  names!: string[];

  @Input()
  clearSubject: Subject<void>;

  selectedNamesArray: string[] = [];
  selectedNamesString: string = '';
  selectOpened: boolean = false;

  @Output()
  nameSelectedEvent = new EventEmitter<string>();

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

  selectName(name: string) {
    if (this.selectedNamesArray.includes(name)) {
      this.selectedNamesArray = this.selectedNamesArray.filter(n => n !== name);
    } else {
      this.selectedNamesArray.push(name);
    }
    this.selectedNamesString = this.selectedNamesArray.join(', ');
    this.nameSelectedEvent.emit(name);
  }

  protected readonly Math = Math;
}