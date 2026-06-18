# ClearBank

ClearBank is a small Angular banking application for creating accounts,
transferring funds between them, and reviewing account transaction history.

The project was built as a front-end take-home exercise. It uses browser
`localStorage` instead of a back-end API, so the application can be installed
and run without any external services.

## Features

- Create multiple Chequing and Savings accounts.
- Set and validate an initial account balance.
- Show account-specific styling for creation actions.
- Transfer funds between two different accounts.
- Prevent zero, negative, and over-balance transfers.
- Update both account balances after a successful transfer.
- Persist accounts and transactions between browser refreshes.
- View incoming and outgoing transactions for a selected account.
- Filter transaction history by account name or transfer direction.
- Navigate between responsive account, transfer, and history pages.
- Reuse a custom button component through a dedicated `SharedModule`.

## Application routes

| Route           | Purpose                                       |
| --------------- | --------------------------------------------- |
| `/accounts/new` | Create an account and review current accounts |
| `/transfers`    | Transfer funds between accounts               |
| `/history`      | View and filter transaction history           |

The root route redirects to `/accounts/new`.

## Technology

- Angular 21
- TypeScript
- Angular Router
- Angular Reactive Forms
- Angular signals
- Bootstrap 5
- SCSS
- Vitest

## Prerequisites

Install:

- Node.js 20.19+, 22.12+, or 24+
- npm 10 or newer

## Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/mithildamani256/brainridge-consulting-takehome.git
cd brainridge-consulting-takehome
npm install
```

## Run the application

Start the Angular development server:

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200) in a browser.

The application automatically reloads when source files change.

## Tests

Run the tests once:

```bash
npm test -- --watch=false
```

Run tests in watch mode:

```bash
npm test
```

The tests cover:

- Account creation and balance rounding
- Successful and rejected fund transfers
- Account-specific transaction queries
- Reactive-form validation
- Incoming and outgoing history entries
- Transaction filtering
- Reusable button behavior
- Responsive navigation state

## Production build

Create an optimized build:

```bash
npm run build
```

The generated files are written to:

```text
dist/banking-transactions-app/
```

## Project structure

```text
src/app/
├── core/
│   ├── models/
│   │   ├── account.ts
│   │   └── transaction.ts
│   └── services/
│       └── account-service.ts
├── features/
│   ├── accounts/
│   │   └── account-creation/
│   ├── transfers/
│   │   └── fund-transfer/
│   └── history/
│       └── transaction-history/
├── shared/
│   ├── components/
│   │   └── button/
│   └── shared-module.ts
├── app-routing-module.ts
├── app-module.ts
└── app.ts
```

### Folder responsibilities

- `core/models` defines the shapes of account and transaction data.
- `core/services` owns shared banking state, operations, and persistence.
- `features/accounts` contains the account-creation page.
- `features/transfers` contains the fund-transfer page.
- `features/history` contains the transaction-history page.
- `shared` contains reusable UI that can be imported by feature modules.
- `app-routing-module.ts` maps browser URLs to page components.
- `app.ts`, `app.html`, and `app.scss` provide the application shell and
  responsive navigation.

## How the data flows

### Account creation

1. `AccountCreationComponent` collects values using a reactive `FormGroup`.
2. Angular validators reject invalid account names or balances.
3. The component sends valid values to `AccountService`.
4. The service creates the account, updates its signal, and saves the account
   list to `localStorage`.
5. Components reading the account signal update automatically.

### Fund transfers

1. `FundTransferComponent` validates the selected accounts and amount.
2. `AccountService` repeats the important business validations.
3. The service subtracts from the source and adds to the destination.
4. A transaction record is created and persisted.
5. Account balances and history update from the shared service state.

### Transaction history

1. The user selects an account.
2. `AccountService` returns transactions involving that account.
3. `TransactionHistoryComponent` derives whether each transaction is incoming
   or outgoing.
4. The component displays the related account, date, and signed amount.

## Validation rules

### Account creation

- Account name is required.
- Account name must contain between 3 and 40 characters.
- Initial balance cannot be negative.
- Account type must be Chequing or Savings.

### Fund transfers

- Both accounts are required.
- Source and destination accounts must be different.
- Amount must be greater than zero.
- Amount cannot exceed the source account balance.
- Both selected accounts must still exist when the transfer is submitted.

## Local storage

The application stores data under these browser keys:

```text
clearbank-accounts
clearbank-transactions
```

To reset the demo data, clear the site data for `localhost` in the browser's
developer tools.

## Design decisions

- Reactive Forms are used instead of mixing `FormBuilder` with `ngModel`.
- Angular signals provide lightweight reactive shared state.
- Banking validations are repeated in the service so they cannot be bypassed
  by calling the service outside the form.
- Transactions are stored once and converted into incoming or outgoing history
  entries for the selected account.
- The reusable button remains in `SharedModule`, as required by the assignment.
- The mobile navigation uses Angular state instead of Bootstrap JavaScript.

## Current limitations

- This is a front-end demonstration and has no authentication or server.
- Data belongs only to the current browser and device.
- Clearing browser storage removes all accounts and transactions.
- JavaScript numbers are suitable for this exercise, but a production banking
  system would store money as integer minor units or use a decimal type.
- The production build may show Angular's default initial-bundle warning
  because the complete Bootstrap stylesheet is included.
