import { Component, Input } from '@angular/core';

import { AccountType } from '../../../core/models/account';

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonVariant = 'primary' | 'secondary' | 'success';
export type ButtonSize = 'regular' | 'large';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class ButtonComponent {
  @Input({ required: true }) label = '';
  @Input() type: ButtonType = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'regular';
  @Input() accountType?: AccountType;
  @Input() disabled = false;
  @Input() fullWidth = false;

  protected get styleVariant(): ButtonVariant {
    if (this.accountType === 'chequing') {
      return 'primary';
    }

    if (this.accountType === 'savings') {
      return 'success';
    }

    return this.variant;
  }
}
