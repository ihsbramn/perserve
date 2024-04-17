import { Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { CostBenefitComponent } from './cost-benefit/cost-benefit.component';

export const routes: Routes = [
  { path: 'user-login', component: UserLoginComponent },
  { path: 'project-list', component: ProjectListComponent },
  { path: 'cost-benefit', component: CostBenefitComponent },
  { path: '', redirectTo: 'user-login', pathMatch: 'full' }
];
