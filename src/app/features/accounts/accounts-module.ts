import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountCreationComponent } from './account-creation/account-creation';

@NgModule({
  declarations: [AccountCreationComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [AccountCreationComponent],
})
export class AccountsModule {}
