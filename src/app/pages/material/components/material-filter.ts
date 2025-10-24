import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { DebounceInput } from '@/common/directives/debounce-input';
import { Subcategory } from '@/common/api/services/subcategory';
import { SubCategoryMaterialResponse } from '@/common/api/interfaces/responses/SubCategoryMaterialResponse';
import { ArraySearch } from '@/common/services/array-search';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryResponse } from '@/common/api/interfaces/responses/CategoryResponse';
import { MaterialFilterSettings } from '../interfaces/MaterialFilterSettings';

@Component({
  selector: 'app-material-filter',
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
        [disabled]="loading || error"
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
      <p-iconfield class="!sticky top-[0.75rem]">
        <p-inputicon class="pi pi-search" />
        <input
          type="text"
          pInputText
          debounceInput
          placeholder="Buscar"
          [enableDebounce]="true"
          (onDebounce)="onSearch($event)"
        />
      </p-iconfield>

      @if (categories.length) {
        <div class="mt-3 flex flex-col gap-2">
          <h6 class="!m-0">Rubros</h6>

          <ul>
            @for (item of categories; track $index) {
              <li
                class="px-2 py-2 hover:bg-black/10 active:bg-black/15 rounded select-none cursor-pointer"
                (click)="filterNow(item)"
              >
                {{ item.categoryName }}
              </li>
            }
          </ul>
        </div>
      }

      @if (subcategories.length) {
        <div class="mt-3 flex flex-col gap-2">
          <h6 class="!m-0">Sub-Rubros</h6>

          <ul>
            @for (item of subcategories; track $index) {
              <li
                class="px-2 py-2 hover:bg-black/10 active:bg-black/15 rounded select-none cursor-pointer"
                (click)="filterNow(item)"
              >
                {{ item.subCategoryName }}
              </li>
            }
          </ul>
        </div>
      }
    </p-popover>
  `,
  styles: '',
})
export class MaterialFilter implements OnInit {
  @ViewChild(Popover)
  private popover?: Popover;

  @Output()
  public onFilter = new EventEmitter<MaterialFilterSettings>();

  protected error = null;
  protected loading = true;

  public filtered = false;
  public selected: SubCategoryMaterialResponse | CategoryResponse | undefined;

  protected subcategories: SubCategoryMaterialResponse[] = [];
  private $subcategories: SubCategoryMaterialResponse[] = [];

  protected categories: CategoryResponse[] = [];
  private $categories: CategoryResponse[] = [];

  constructor(
    private subcategoryService: Subcategory,
    private arraySearch: ArraySearch,
  ) {}

  public ngOnInit() {
    this.loadData();
  }

  private makeCategoryArray(subcategories: SubCategoryMaterialResponse[]) {
    const _categories: CategoryResponse[] = [];

    for (const subcategory of subcategories) {
      const category = subcategory.categoryId;
      const exist = _categories.some(
        (v) => v.categoryId === category.categoryId,
      );

      if (!exist) {
        _categories.push(category);
      }
    }

    this.categories = _categories;
    this.$categories = [..._categories];
  }

  public loadData() {
    this.error = null;
    this.loading = true;

    this.subcategoryService.getSubcategories().subscribe({
      next: (response) => {
        this.$subcategories = [...response];
        this.subcategories = response;
        this.makeCategoryArray(response);
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  protected onSearch(event: string) {
    this.subcategories = this.arraySearch.search(
      this.$subcategories,
      ['subCategoryName'],
      event,
    );

    this.categories = this.arraySearch.search(
      this.$categories,
      ['categoryName'],
      event,
    );
  }

  protected filterNow(
    _selected: SubCategoryMaterialResponse | CategoryResponse,
  ) {
    this.selected = _selected;
    this.filtered = true;
    const data: MaterialFilterSettings = {
      categoryId: null,
      subCategoryMaterialId: null,
    };

    if ('subCategoryMaterialId' in _selected) {
      data.subCategoryMaterialId = _selected.subCategoryMaterialId;
    } else {
      data.categoryId = _selected.categoryId;
    }

    this.popover?.hide();
    this.onFilter.emit(data);
  }

  protected clearFilter() {
    this.selected = undefined;
    this.filtered = false;
    this.onFilter.emit({
      categoryId: null,
      subCategoryMaterialId: null,
    });
  }
}
