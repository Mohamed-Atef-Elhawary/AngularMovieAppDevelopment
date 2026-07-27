// NavbarComponent.ts
import { Component, computed, linkedSignal, signal, ViewEncapsulation } from '@angular/core';
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

import { RouterLink } from '@angular/router';
import { SearchService } from '../../services/search-service';

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
  navLinks = signal(['Home', 'Favorite', 'Login']);
  activeLink = linkedSignal(() => this.navLinks()[0]);

  constructor(private searchService: SearchService) {}
  onInput(event: Event) {
    let input = event.target as HTMLInputElement;
    this.searchService.inputValue.set(input.value);
  }
}
