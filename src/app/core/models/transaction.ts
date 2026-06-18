export interface TransferInput {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}

export interface BankTransaction extends TransferInput {
  id: string;
  createdAt: string;
}

export type TransferError =
  | 'account-not-found'
  | 'same-account'
  | 'invalid-amount'
  | 'insufficient-funds';

export interface TransferResult {
  success: boolean;
  transaction?: BankTransaction;
  error?: TransferError;
}
