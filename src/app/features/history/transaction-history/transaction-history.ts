import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BankAccount } from '../../../core/models/account';
import { BankTransaction } from '../../../core/models/transaction';
import { AccountService } from '../../../core/services/account-service';

interface TransactionHistoryEntry {
  id: string;
  direction: 'incoming' | 'outgoing';
  relatedAccountName: string;
  amount: number;
  createdAt: string;
}

@Component({
  selector: 'app-transaction-history',
  standalone: false,
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.scss',
})
export class TransactionHistoryComponent {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly accountService = inject(AccountService);

  protected readonly historyForm = this.formBuilder.nonNullable.group({
    accountId: [''],
    searchTerm: [''],
  });

  protected get selectedAccount(): BankAccount | undefined {
    return this.accountService.getAccountById(this.historyForm.controls.accountId.value);
  }

  protected get historyEntries(): TransactionHistoryEntry[] {
    const selectedAccountId = this.historyForm.controls.accountId.value;
    const searchTerm = this.historyForm.controls.searchTerm.value.trim().toLowerCase();

    if (!selectedAccountId) {
      return [];
    }

    return this.accountService
      .getTransactionsForAccount(selectedAccountId)
      .map((transaction) => this.toHistoryEntry(transaction, selectedAccountId))
      .filter((entry) => {
        if (!searchTerm) {
          return true;
        }

        return (
          entry.relatedAccountName.toLowerCase().includes(searchTerm) ||
          entry.direction.includes(searchTerm)
        );
      });
  }

  private toHistoryEntry(
    transaction: BankTransaction,
    selectedAccountId: string,
  ): TransactionHistoryEntry {
    const isOutgoing = transaction.fromAccountId === selectedAccountId;
    const relatedAccountId = isOutgoing ? transaction.toAccountId : transaction.fromAccountId;

    return {
      id: transaction.id,
      direction: isOutgoing ? 'outgoing' : 'incoming',
      relatedAccountName:
        this.accountService.getAccountById(relatedAccountId)?.name ?? 'Unknown account',
      amount: transaction.amount,
      createdAt: transaction.createdAt,
    };
  }
}
