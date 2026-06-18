import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared-module';
import { FundTransferComponent } from './fund-transfer/fund-transfer';

@NgModule({
  declarations: [FundTransferComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SharedModule],
  exports: [FundTransferComponent],
})
export class TransfersModule {}
