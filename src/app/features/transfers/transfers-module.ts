import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FundTransferComponent } from './fund-transfer/fund-transfer';

@NgModule({
  declarations: [FundTransferComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  exports: [FundTransferComponent],
})
export class TransfersModule {}
