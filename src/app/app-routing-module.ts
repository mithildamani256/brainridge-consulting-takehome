import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountCreationComponent } from './features/accounts/account-creation/account-creation';

const routes: Routes = [
  {
    path: 'accounts/new',
    component: AccountCreationComponent,
    title: 'Create account | ClearBank',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'accounts/new',
  },
  {
    path: '**',
    redirectTo: 'accounts/new',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
