import { Routes } from '@angular/router';
import { TablesComponent } from './components/tables/tables.component';

export const routes: Routes = [
    { path: '', redirectTo: 'tables', pathMatch: 'full' },
    { path: 'tables', component: TablesComponent },
];
