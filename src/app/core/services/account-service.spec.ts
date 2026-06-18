import { TestBed } from '@angular/core/testing';

import { AccountService } from './account-service';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountService);
  });

  it('should create an account and add it to the account list', () => {
    const account = service.createAccount({
      accountName: 'Everyday spending',
      accountType: 'chequing',
      initialBalance: 125.5,
    });

    expect(service.accounts()).toHaveLength(1);
    expect(account.name).toBe('Everyday spending');
    expect(account.type).toBe('chequing');
    expect(account.balance).toBe(125.5);
  });

  it('should round balances to two decimal places', () => {
    const account = service.createAccount({
      accountName: 'Emergency fund',
      accountType: 'savings',
      initialBalance: 20.999,
    });

    expect(account.balance).toBe(21);
  });

  it('should transfer funds and record a transaction', () => {
    const source = service.createAccount({
      accountName: 'Everyday spending',
      accountType: 'chequing',
      initialBalance: 500,
    });
    const destination = service.createAccount({
      accountName: 'Emergency fund',
      accountType: 'savings',
      initialBalance: 100,
    });

    const result = service.transferFunds({
      fromAccountId: source.id,
      toAccountId: destination.id,
      amount: 125.25,
    });

    expect(result.success).toBe(true);
    expect(service.accounts().find((account) => account.id === source.id)?.balance).toBe(374.75);
    expect(service.accounts().find((account) => account.id === destination.id)?.balance).toBe(
      225.25,
    );
    expect(service.transactions()).toHaveLength(1);
    expect(service.transactions()[0].amount).toBe(125.25);
  });

  it('should reject a transfer that exceeds the source balance', () => {
    const source = service.createAccount({
      accountName: 'Everyday spending',
      accountType: 'chequing',
      initialBalance: 50,
    });
    const destination = service.createAccount({
      accountName: 'Emergency fund',
      accountType: 'savings',
      initialBalance: 100,
    });

    const result = service.transferFunds({
      fromAccountId: source.id,
      toAccountId: destination.id,
      amount: 75,
    });

    expect(result).toEqual({
      success: false,
      error: 'insufficient-funds',
    });
    expect(service.accounts().find((account) => account.id === source.id)?.balance).toBe(50);
    expect(service.transactions()).toHaveLength(0);
  });

  it('should reject transfers between the same account', () => {
    const account = service.createAccount({
      accountName: 'Everyday spending',
      accountType: 'chequing',
      initialBalance: 50,
    });

    const result = service.transferFunds({
      fromAccountId: account.id,
      toAccountId: account.id,
      amount: 10,
    });

    expect(result.error).toBe('same-account');
    expect(service.transactions()).toHaveLength(0);
  });

  it('should return only transactions belonging to an account', () => {
    const chequing = service.createAccount({
      accountName: 'Everyday spending',
      accountType: 'chequing',
      initialBalance: 500,
    });
    const savings = service.createAccount({
      accountName: 'Emergency fund',
      accountType: 'savings',
      initialBalance: 100,
    });
    const travel = service.createAccount({
      accountName: 'Travel fund',
      accountType: 'savings',
      initialBalance: 200,
    });

    service.transferFunds({
      fromAccountId: chequing.id,
      toAccountId: savings.id,
      amount: 25,
    });
    service.transferFunds({
      fromAccountId: travel.id,
      toAccountId: savings.id,
      amount: 50,
    });

    expect(service.getTransactionsForAccount(chequing.id)).toHaveLength(1);
    expect(service.getTransactionsForAccount(savings.id)).toHaveLength(2);
    expect(service.getTransactionsForAccount(travel.id)).toHaveLength(1);
  });
});
