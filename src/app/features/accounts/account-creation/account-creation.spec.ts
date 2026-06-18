import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountService } from '../../../core/services/account-service';
import { AccountCreationComponent } from './account-creation';

describe('AccountCreationComponent', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AccountCreationComponent],
    }).compileComponents();
  });

  it('should not create an account when the form is invalid', () => {
    const fixture = TestBed.createComponent(AccountCreationComponent);
    const service = TestBed.inject(AccountService);

    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(service.accounts()).toHaveLength(0);
  });

  it('should create an account from valid form values', () => {
    const fixture = TestBed.createComponent(AccountCreationComponent);
    const service = TestBed.inject(AccountService);
    const inputs = fixture.nativeElement.querySelectorAll('input');

    fixture.detectChanges();

    inputs[0].value = 'Holiday savings';
    inputs[0].dispatchEvent(new Event('input'));
    inputs[2].click();
    inputs[3].value = '500';
    inputs[3].dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(service.accounts()).toHaveLength(1);
    expect(service.accounts()[0].name).toBe('Holiday savings');
    expect(service.accounts()[0].type).toBe('savings');
    expect(service.accounts()[0].balance).toBe(500);
  });
});
