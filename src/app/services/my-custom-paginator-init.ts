import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  firstPageLabel = $localize`First Page`;
  itemsPerPageLabel: string = $localize`Items per page:`;
  lastPageLabel: string = $localize`Last page`;
  nextPageLabel: string = $localize`Next page`;
  previousPageLabel: string = $localize`Previous page`;
  getRangeLabel: (page: number, pageSize: number, length: number) => string = (
    page: number,
    pageSize: number,
    length: number,
  ) => {
    if (!length) {
      return $localize`Page 1 of 1`;
    }
    const pageNumber = page + 1;
    const amountPage = Math.ceil(length / pageSize);
    return $localize`Page ${Math.min(pageNumber, amountPage)} of ${Math.ceil(length / pageSize)}`;
  };
}
