import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AccountsModule } from './features/accounts/accounts-module';
import { HistoryModule } from './features/history/history-module';
import { TransfersModule } from './features/transfers/transfers-module';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, AccountsModule, TransfersModule, HistoryModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
