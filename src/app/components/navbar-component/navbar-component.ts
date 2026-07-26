// NavbarComponent.ts
import { Component, linkedSignal, signal, ViewEncapsulation } from '@angular/core';
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
  // navLinks: string[] = ['Home', 'Favorite', 'Login'];
  navLinks = signal(['Home', 'Favorite', 'Login']);
  searchString: string = '';
  activeLink = linkedSignal(() => this.navLinks()[0]);
}
