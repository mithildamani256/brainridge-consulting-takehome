import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AccountType } from '../../../core/models/account';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-account-creation',
  standalone: false,
  templateUrl: './account-creation.html',
  styleUrl: './account-creation.scss',
})
export class AccountCreationComponent {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly accountService = inject(AccountService);

  protected successMessage = '';

  protected readonly accountForm = this.formBuilder.nonNullable.group({
    accountName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    initialBalance: [0, [Validators.required, Validators.min(0)]],
    accountType: ['chequing' as AccountType, Validators.required],
  });

  protected get selectedAccountType(): AccountType {
    return this.accountForm.controls.accountType.value;
  }

  protected createAccount(): void {
    this.successMessage = '';

    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const account = this.accountService.createAccount(this.accountForm.getRawValue());

    this.successMessage = `${account.name} was created successfully.`;
    this.accountForm.reset({
      accountName: '',
      initialBalance: 0,
      accountType: 'chequing',
    });
  }
}
