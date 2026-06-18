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
});
