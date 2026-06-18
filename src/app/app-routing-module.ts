import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountCreationComponent } from './features/accounts/account-creation/account-creation';
import { TransactionHistoryComponent } from './features/history/transaction-history/transaction-history';
import { FundTransferComponent } from './features/transfers/fund-transfer/fund-transfer';

const routes: Routes = [
  {
    path: 'accounts/new',
    component: AccountCreationComponent,
    title: 'Create account | ClearBank',
  },
  {
    path: 'transfers',
    component: FundTransferComponent,
    title: 'Transfer funds | ClearBank',
  },
  {
    path: 'history',
    component: TransactionHistoryComponent,
    title: 'Transaction history | ClearBank',
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
