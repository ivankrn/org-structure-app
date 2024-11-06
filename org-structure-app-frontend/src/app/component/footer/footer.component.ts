import { Component, inject, signal, WritableSignal } from '@angular/core';
import { OrganizationalUnitService } from '../../service/organizational-unit.service';
import { Observable, switchMap } from 'rxjs';
import { OrganizationUnitAggregation } from '../../model/organization-unit-aggregation.model';
import { JobTitleStatistic } from '../../model/job-title-statistic.model';
import { FooterSwitch } from '../../model/footer-switch.enum';
import { NgClass } from '@angular/common';
import { SELECTED_UNITS } from '../../tokens/selected-units.token';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'footer-quantity-and-payroll',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  protected totalPositionsAmount: WritableSignal<number> = signal(0);
  protected employeesAmount: WritableSignal<number> = signal(0);
  protected vacanciesAmount: WritableSignal<number> = signal(0);
  protected totalWageFund: WritableSignal<number> = signal(0);
  protected jobTitleStatistic: WritableSignal<JobTitleStatistic[]> = signal([]);

  protected currentSwitch: WritableSignal<FooterSwitch> = signal(FooterSwitch.quantity);
  protected readonly footerSwitch = FooterSwitch;

  private organizationalUnitService: OrganizationalUnitService = inject(OrganizationalUnitService);
  private selectedUnits: Observable<number[]> = inject(SELECTED_UNITS).asObservable();

  private isShowFooter: boolean = false;

  constructor() {
    this.selectedUnits
        .pipe(
            switchMap((ids: number[]) => this.organizationalUnitService.aggregateByIds(ids)),
            takeUntilDestroyed()
        )
        .subscribe((data: OrganizationUnitAggregation) => {
          this.totalPositionsAmount.set(data.totalPositionsAmount ?? 0);
          this.employeesAmount.set(data.employeesAmount ?? 0);
          this.vacanciesAmount.set(data.vacanciesAmount ?? 0);
          this.totalWageFund.set(data.totalWageFund ?? 0);
          this.jobTitleStatistic.set(data.jobTitlesStatistics ?? []);
        });
  }

  protected changeFooterState(): void {
    const button: HTMLElement | null = document.getElementById('footer-button');

    if (!button) {
      return;
    }

    if (this.isShowFooter) {
      this.isShowFooter = false;
      button.style.bottom = '0';
    } else {
      this.isShowFooter = true;
      setTimeout(() => {
        const footer: HTMLElement | null = document.getElementById('footer-body');
        button.style.bottom = footer?.getBoundingClientRect().height + 'px';
      }, 0);
    }
  }
}
