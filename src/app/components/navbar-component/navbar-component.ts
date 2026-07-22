// NavbarComponent.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterLink, FormsModule, MatInputModule],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css'],
})
export class NavbarComponent {
  navLinks: string[] = ['Home', 'Favorite', 'Login'];
  searchString: string = '';
}
