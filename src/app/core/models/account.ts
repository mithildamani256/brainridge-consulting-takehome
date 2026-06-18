export type AccountType = 'chequing' | 'savings';

export interface BankAccount {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  createdAt: string;
}

export interface CreateAccountInput {
  accountName: string;
  accountType: AccountType;
  initialBalance: number;
}
