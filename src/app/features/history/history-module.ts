import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TransactionHistoryComponent } from './transaction-history/transaction-history';

@NgModule({
  declarations: [TransactionHistoryComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  exports: [TransactionHistoryComponent],
})
export class HistoryModule {}
