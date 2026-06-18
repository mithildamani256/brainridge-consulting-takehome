import { Injectable, signal } from '@angular/core';

import { BankAccount, CreateAccountInput } from '../models/account';
import { BankTransaction, TransferInput, TransferResult } from '../models/transaction';

const ACCOUNTS_STORAGE_KEY = 'clearbank-accounts';
const TRANSACTIONS_STORAGE_KEY = 'clearbank-transactions';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly accountsState = signal<BankAccount[]>(this.loadAccounts());
  private readonly transactionsState = signal<BankTransaction[]>(this.loadTransactions());

  readonly accounts = this.accountsState.asReadonly();
  readonly transactions = this.transactionsState.asReadonly();

  createAccount(input: CreateAccountInput): BankAccount {
    const account: BankAccount = {
      id: this.createId(),
      name: input.accountName.trim(),
      type: input.accountType,
      balance: this.toCurrency(input.initialBalance),
      createdAt: new Date().toISOString(),
    };

    this.accountsState.update((accounts) => [...accounts, account]);
    this.saveAccounts();

    return account;
  }

  transferFunds(input: TransferInput): TransferResult {
    const amount = this.toCurrency(Number(input.amount));
    const fromAccount = this.accountsState().find((account) => account.id === input.fromAccountId);
    const toAccount = this.accountsState().find((account) => account.id === input.toAccountId);

    if (!fromAccount || !toAccount) {
      return { success: false, error: 'account-not-found' };
    }

    if (fromAccount.id === toAccount.id) {
      return { success: false, error: 'same-account' };
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return { success: false, error: 'invalid-amount' };
    }

    if (amount > fromAccount.balance) {
      return { success: false, error: 'insufficient-funds' };
    }

    this.accountsState.update((accounts) =>
      accounts.map((account) => {
        if (account.id === fromAccount.id) {
          return {
            ...account,
            balance: this.toCurrency(account.balance - amount),
          };
        }

        if (account.id === toAccount.id) {
          return {
            ...account,
            balance: this.toCurrency(account.balance + amount),
          };
        }

        return account;
      }),
    );

    const transaction: BankTransaction = {
      id: this.createId(),
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      amount,
      createdAt: new Date().toISOString(),
    };

    this.transactionsState.update((transactions) => [transaction, ...transactions]);
    this.saveAccounts();
    this.saveTransactions();

    return { success: true, transaction };
  }

  private loadAccounts(): BankAccount[] {
    return this.loadFromStorage<BankAccount[]>(ACCOUNTS_STORAGE_KEY, []);
  }

  private loadTransactions(): BankTransaction[] {
    return this.loadFromStorage<BankTransaction[]>(TRANSACTIONS_STORAGE_KEY, []);
  }

  private saveAccounts(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(this.accountsState()));
    }
  }

  private saveTransactions(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(this.transactionsState()));
    }
  }

  private loadFromStorage<T>(key: string, fallback: T): T {
    if (typeof localStorage === 'undefined') {
      return fallback;
    }

    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : fallback;
    } catch {
      return fallback;
    }
  }

  private createId(): string {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private toCurrency(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
