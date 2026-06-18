import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccountService } from '../../../core/services/account-service';
import { FundTransferComponent } from './fund-transfer';

describe('FundTransferComponent', () => {
  let accountService: AccountService;
  let sourceId: string;
  let destinationId: string;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterModule.forRoot([])],
      declarations: [FundTransferComponent],
    }).compileComponents();

    accountService = TestBed.inject(AccountService);
    sourceId = accountService.createAccount({
      accountName: 'Everyday spending',
      accountType: 'chequing',
      initialBalance: 500,
    }).id;
    destinationId = accountService.createAccount({
      accountName: 'Emergency fund',
      accountType: 'savings',
      initialBalance: 100,
    }).id;
  });

  it('should reject an amount greater than the available balance', () => {
    const fixture = TestBed.createComponent(FundTransferComponent);
    const component = fixture.componentInstance as any;

    component.transferForm.setValue({
      fromAccountId: sourceId,
      toAccountId: destinationId,
      amount: 600,
    });

    expect(component.transferForm.hasError('insufficientFunds')).toBe(true);
  });

  it('should transfer funds using valid form values', () => {
    const fixture = TestBed.createComponent(FundTransferComponent);
    const component = fixture.componentInstance as any;

    component.transferForm.setValue({
      fromAccountId: sourceId,
      toAccountId: destinationId,
      amount: 75,
    });
    component.transferFunds();

    expect(accountService.accounts().find((account) => account.id === sourceId)?.balance).toBe(425);
    expect(accountService.accounts().find((account) => account.id === destinationId)?.balance).toBe(
      175,
    );
    expect(component.feedbackType).toBe('success');
  });
});
