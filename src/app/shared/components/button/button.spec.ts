import { TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button';

describe('ButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
    }).compileComponents();
  });

  it('should render its label and native button type', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('label', 'Transfer funds');
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.textContent).toContain('Transfer funds');
    expect(button.type).toBe('submit');
  });

  it('should use account-specific styling', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('label', 'Create savings account');
    fixture.componentRef.setInput('accountType', 'savings');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.classList.contains('btn-success')).toBe(true);
  });

  it('should support disabled and full-width states', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('label', 'Submit');
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.classList.contains('w-100')).toBe(true);
  });
});
