import { Injectable, signal } from '@angular/core';

import { BankAccount, CreateAccountInput } from '../models/account';

const STORAGE_KEY = 'clearbank-accounts';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly accountsState = signal<BankAccount[]>(this.loadAccounts());

  readonly accounts = this.accountsState.asReadonly();

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

  private loadAccounts(): BankAccount[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const storedAccounts = localStorage.getItem(STORAGE_KEY);
      return storedAccounts ? JSON.parse(storedAccounts) : [];
    } catch {
      return [];
    }
  }

  private saveAccounts(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.accountsState()));
    }
  }

  private createId(): string {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private toCurrency(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
