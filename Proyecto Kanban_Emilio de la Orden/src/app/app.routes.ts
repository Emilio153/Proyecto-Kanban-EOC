import { Routes } from '@angular/router';
import { Board } from './components/board/board';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'board/:id', component: Board },
    { path: 'usuarios', loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent) },
    { path: '**', redirectTo: '' },
];
