import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home-component/home-component').then((c) => c.HomeComponent),
  },
  {
    path: 'favorit',
    loadComponent: () =>
      import('./pages/favorite-component/favorite-component').then((c) => c.FavoriteComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-component/login-component').then((c) => c.LoginComponent),
  },
];
