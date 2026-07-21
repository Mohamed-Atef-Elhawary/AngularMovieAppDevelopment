import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home-component/home-component').then((c) => c.HomeComponent),
  },
  {
    path: 'favorit',
    loadComponent: () =>
      import('./components/favorite-component/favorite-component').then((c) => c.FavoriteComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login-component/login-component').then((c) => c.LoginComponent),
  },
];
