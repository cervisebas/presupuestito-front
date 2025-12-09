import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { DebounceInput } from '@/common/directives/debounce-input';
import { InputTextModule } from 'primeng/inputtext';
import { BudgetStatements } from '../constants/BudgetStatements';
import { BudgetFilterSettings } from '../interfaces/BudgetFilterSettings';

@Component({
  selector: 'app-budget-filter',
  imports: [
    ButtonModule,
    Popover,
    IconField,
    InputIcon,
    FormsModule,
    DebounceInput,
    InputTextModule,
  ],
  template: `
    @if (filtered) {
      <p-button
        severity="danger"
        icon="pi pi-filter-slash"
        (click)="clearFilter()"
      />
    } @else {
      <p-button
        (click)="op.toggle($event)"
        severity="contrast"
        icon="pi pi-filter"
      />
    }

    <p-popover #op styleClass="max-h-[400px] overflow-y-scroll">
      <div class="mt-2 flex flex-col gap-2">
        <h6 class="!m-0">Estado</h6>

        <ul>
          @for (item of BudgetStatements; track $index) {
            <li
              class="px-2 py-2 hover:bg-black/10 active:bg-black/15 rounded select-none cursor-pointer"
              (click)="filterNow(item.value)"
            >
              {{ item.label }}
            </li>
          }
        </ul>
      </div>
    </p-popover>
  `,
  styles: '',
})
export class BudgetFilter {
  @ViewChild(Popover)
  private popover?: Popover;

  @Output()
  public onFilter = new EventEmitter<BudgetFilterSettings>();

  public filtered = false;
  public selected: string | undefined;

  protected readonly BudgetStatements = BudgetStatements;

  constructor() {}

  protected filterNow(value: string) {
    this.selected = value;
    this.filtered = true;
    this.popover?.hide();
    this.onFilter.emit({ budgetStatus: value });
  }

  protected clearFilter() {
    this.selected = undefined;
    this.filtered = false;
    this.onFilter.emit({ budgetStatus: null });
  }
}
