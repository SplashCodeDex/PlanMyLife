import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'slides',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'list-details/:listId',
    loadComponent: () => import('./pages/list-details/list-details.page').then(m => m.ListDetailsPage)
  },
  {
    path: 'todo-details/:listId/:todoId',
    loadComponent: () => import('./pages/todo-details/todo-details.page').then(m => m.TodoDetailsPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'profil',
    loadComponent: () => import('./pages/profil/profil.page').then(m => m.ProfilPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage)
  },
  {
    path: 'slides',
    loadComponent: () => import('./pages/slides/slides.page').then(m => m.SlidesPage)
  }
];
