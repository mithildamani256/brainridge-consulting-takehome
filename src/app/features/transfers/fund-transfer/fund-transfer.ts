import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';

import { BankAccount } from '../../../core/models/account';
import { TransferError } from '../../../core/models/transaction';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-fund-transfer',
  standalone: false,
  templateUrl: './fund-transfer.html',
  styleUrl: './fund-transfer.scss',
})
export class FundTransferComponent {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly accountService = inject(AccountService);

  protected feedbackMessage = '';
  protected feedbackType: 'success' | 'danger' = 'success';

  private readonly accountsMustDiffer = (control: AbstractControl): ValidationErrors | null => {
    const fromAccountId = control.get('fromAccountId')?.value;
    const toAccountId = control.get('toAccountId')?.value;

    if (fromAccountId && toAccountId && fromAccountId === toAccountId) {
      return { sameAccount: true };
    }

    return null;
  };

  private readonly hasSufficientFunds = (control: AbstractControl): ValidationErrors | null => {
    const fromAccountId = control.get('fromAccountId')?.value;
    const amount = Number(control.get('amount')?.value);
    const sourceAccount = this.accountService
      .accounts()
      .find((account) => account.id === fromAccountId);

    if (sourceAccount && amount > sourceAccount.balance) {
      return { insufficientFunds: true };
    }

    return null;
  };

  protected readonly transferForm = this.formBuilder.nonNullable.group(
    {
      fromAccountId: ['', Validators.required],
      toAccountId: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
    },
    {
      validators: [this.accountsMustDiffer, this.hasSufficientFunds],
    },
  );

  protected get sourceAccount(): BankAccount | undefined {
    return this.accountService
      .accounts()
      .find((account) => account.id === this.transferForm.controls.fromAccountId.value);
  }

  protected transferFunds(): void {
    this.feedbackMessage = '';
    this.transferForm.updateValueAndValidity();

    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    const result = this.accountService.transferFunds(this.transferForm.getRawValue());

    if (!result.success) {
      this.feedbackType = 'danger';
      this.feedbackMessage = this.getErrorMessage(result.error);
      return;
    }

    this.feedbackType = 'success';
    this.feedbackMessage = `Transfer of ${this.formatCurrency(
      result.transaction!.amount,
    )} completed successfully.`;
    this.transferForm.reset({
      fromAccountId: '',
      toAccountId: '',
      amount: 0,
    });
  }

  private getErrorMessage(error?: TransferError): string {
    const errorMessages: Record<TransferError, string> = {
      'account-not-found': 'One of the selected accounts is no longer available.',
      'same-account': 'Choose two different accounts.',
      'invalid-amount': 'Enter an amount greater than zero.',
      'insufficient-funds': 'The source account does not have enough funds.',
    };

    return error ? errorMessages[error] : 'The transfer could not be completed.';
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  }
}
