import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  inputValue = signal<string>(environment.s);
  searchValue$ = toObservable(this.inputValue).pipe(debounceTime(1000), distinctUntilChanged());
}
