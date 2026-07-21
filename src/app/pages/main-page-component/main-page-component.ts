import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar-component/navbar-component';

@Component({
  selector: 'app-main-page-component',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './main-page-component.html',
  styleUrl: './main-page-component.css',
})
export class MainPageComponent {}
