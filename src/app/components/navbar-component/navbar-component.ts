// NavbarComponent.ts
import {
  ChangeDetectorRef,
  Component,
  computed,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';

import { ActivatedRoute, NavigationEnd, Route, Router, RouterLink } from '@angular/router';
import { SearchService } from '../../services/search-service';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    FormsModule,
    MatInputModule,
    MatTabsModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css'],
  // encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {
  endPoint!: string;
  index!: number;
  navLinks = signal(['Home', 'Favorite']);
  activeLink = linkedSignal(() => this.navLinks()[this.getActiveLinkIndex()]);
  isLoged = computed(() => this.authService.uid());

  constructor(
    private searchService: SearchService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.endPoint = `${event.urlAfterRedirects.slice(1, 2).toUpperCase()}${event.urlAfterRedirects.slice(2)}`;
        this.index = this.navLinks().indexOf(this.endPoint);
        this.activeLink.update(() => this.navLinks()[this.index]);
        localStorage.setItem('index', String(this.index));
      });
  }
  getActiveLinkIndex(): number {
    return Number(localStorage.getItem('index'));
  }
  onInput(event: Event) {
    let input = event.target as HTMLInputElement;
    this.searchService.inputValue.set(input.value);
  }
  logout() {
    this.authService.logout();
  }
}
