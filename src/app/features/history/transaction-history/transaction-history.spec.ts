import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccountService } from '../../../core/services/account-service';
import { TransactionHistoryComponent } from './transaction-history';

describe('TransactionHistoryComponent', () => {
  let accountService: AccountService;
  let chequingId: string;
  let savingsId: string;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterModule.forRoot([])],
      declarations: [TransactionHistoryComponent],
    }).compileComponents();

    accountService = TestBed.inject(AccountService);
    chequingId = accountService.createAccount({
      accountName: 'Everyday spending',
      accountType: 'chequing',
      initialBalance: 500,
    }).id;
    savingsId = accountService.createAccount({
      accountName: 'Emergency fund',
      accountType: 'savings',
      initialBalance: 100,
    }).id;
    accountService.transferFunds({
      fromAccountId: chequingId,
      toAccountId: savingsId,
      amount: 50,
    });
  });

  it('should show an outgoing entry for the sending account', () => {
    const fixture = TestBed.createComponent(TransactionHistoryComponent);
    const component = fixture.componentInstance as any;

    component.historyForm.controls.accountId.setValue(chequingId);

    expect(component.historyEntries).toHaveLength(1);
    expect(component.historyEntries[0].direction).toBe('outgoing');
    expect(component.historyEntries[0].relatedAccountName).toBe('Emergency fund');
  });

  it('should show an incoming entry for the receiving account', () => {
    const fixture = TestBed.createComponent(TransactionHistoryComponent);
    const component = fixture.componentInstance as any;

    component.historyForm.controls.accountId.setValue(savingsId);

    expect(component.historyEntries[0].direction).toBe('incoming');
    expect(component.historyEntries[0].relatedAccountName).toBe('Everyday spending');
  });

  it('should filter history by related account name', () => {
    const fixture = TestBed.createComponent(TransactionHistoryComponent);
    const component = fixture.componentInstance as any;

    component.historyForm.setValue({
      accountId: chequingId,
      searchTerm: 'emergency',
    });
    expect(component.historyEntries).toHaveLength(1);

    component.historyForm.controls.searchTerm.setValue('travel');
    expect(component.historyEntries).toHaveLength(0);
  });
});
