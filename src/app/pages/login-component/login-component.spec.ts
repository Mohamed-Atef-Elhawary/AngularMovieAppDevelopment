import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login-component';
import { Mock } from 'vitest';
import { AuthService } from '../../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { snakBarConfig } from '../../config/snakbar-config';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  BaseHarnessFilters,
  ComponentHarness,
  HarnessLoader,
  HarnessPredicate,
  TestElement,
} from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
interface AuthServiceInterface {
  login: Mock;
  register: Mock;
  setUserId: Mock;
}
interface MatSnackBarInterface {
  open: Mock;
}

interface RouterInterface {
  navigate: Mock;
}
interface PasswordMismatchHarnessFilters extends BaseHarnessFilters {
  text?: string | RegExp;
}
class PasswordMismatchHarness extends ComponentHarness {
  static hostSelector = 'mat-error';
  static with(
    options: PasswordMismatchHarnessFilters = {},
  ): HarnessPredicate<PasswordMismatchHarness> {
    return new HarnessPredicate(PasswordMismatchHarness, options).addOption(
      'text',
      options.text,
      (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text),
    );
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}
describe('LoginComponent', () => {
  let loginComponent: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugElement: DebugElement;
  const mockAuthService: AuthServiceInterface = {
    login: vi.fn(),
    register: vi.fn(),
    setUserId: vi.fn(),
  };
  const mockMatSnackBar: MatSnackBarInterface = {
    open: vi.fn(),
  };
  const mockRouter: RouterInterface = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    loginComponent = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('component logic', () => {
    it('should create', () => {
      expect(loginComponent).toBeTruthy();
    });
    describe('makeForm', () => {
      let controls: string[] = [];

      beforeEach(() => {
        controls = Object.keys(loginComponent.loginForm.controls);
      });
      it('should build loginForm with two controls', () => {
        expect(controls.length).toBe(2);
      });
      it('should loginForm includes email control', () => {
        expect(controls).toContain('email');
      });
      it('should loginForm includes password control', () => {
        expect(controls).toContain('password');
      });
      describe('email validation', () => {
        it('should be invalid for a malFormated email address', () => {
          loginComponent.email?.setValue('example@email');
          expect(loginComponent.email?.invalid).toBe(true);
        });
        it('should be valid well formatted email address', () => {
          loginComponent.email?.setValue('example@email.com');
          expect(loginComponent.email?.valid).toBe(true);
        });
      });
      describe('password validation', () => {
        it('should be invalid if shorter than 6', () => {
          loginComponent.password?.setValue('12345');
          expect(loginComponent.password?.invalid).toBe(true);
        });
        it('should be invalid if starts with space', () => {
          loginComponent.password?.setValue(' 12345');
          expect(loginComponent.password?.invalid).toBe(true);
        });
        it('should be valid if the length is 6 or more', () => {
          loginComponent.password?.setValue('123456');
          expect(loginComponent.password?.valid).toBe(true);
        });
      });
    });
    describe('isEqual', () => {
      describe('when pass and confirmPass are exists', () => {
        beforeEach(() => {
          loginComponent.toggleStatus();
        });
        it('should return null if pass and confirmPass values are eqaul', () => {
          loginComponent.loginForm.get('password')?.setValue('123');
          loginComponent.loginForm.get('confirmPassword')?.setValue('123');
          expect(loginComponent.isEqual(loginComponent.loginForm)).toBe(null);
        });
        it('should return ValidationErrors if pass and confirmPass values are not eqaul', () => {
          loginComponent.loginForm.get('password')?.setValue('123');
          loginComponent.loginForm.get('confirmPassword')?.setValue('12');
          expect(loginComponent.isEqual(loginComponent.loginForm)).toEqual({
            passwordMismatch: true,
          });
        });
      });
      describe('when pass and confirmPass not  exists', () => {
        it('should return null', () => {
          loginComponent.loginForm.get('password')?.setValue('123');
          expect(loginComponent.isEqual(loginComponent.loginForm)).toBe(null);
        });
      });
    });
    describe('checkFormEquality', () => {
      describe('when confirmPassword does not exist (login mode)', () => {
        it('should return false', () => {
          expect(loginComponent.checkFormEquality()).toBe(false);
        });
      });
      describe('when password and confirmPassword are pristine', () => {
        beforeEach(() => {
          loginComponent.toggleStatus();
        });
        it('should return false', () => {
          expect(loginComponent.checkFormEquality()).toBe(false);
        });
      });
      describe('when password and confirmPassword are valid', () => {
        beforeEach(() => {
          loginComponent.toggleStatus();
          loginComponent.password?.setValue('111111');
          loginComponent.confirmPassword?.setValue('111111');
        });
        it('should return true if both are dirty', () => {
          loginComponent.password?.markAsDirty();
          loginComponent.confirmPassword?.markAsDirty();

          expect(loginComponent.checkFormEquality()).toBe(true);
        });
        it('should return false if password is pristine', () => {
          loginComponent.confirmPassword?.markAsDirty();
          expect(loginComponent.checkFormEquality()).toBe(false);
        });
        it('should return false if confirmPassword is pristine', () => {
          loginComponent.password?.markAsDirty();
          expect(loginComponent.checkFormEquality()).toBe(false);
        });
      });
      describe('when password and confirmPassword are invalid', () => {
        beforeEach(() => {
          loginComponent.toggleStatus();
          loginComponent.password?.markAsDirty();
          loginComponent.confirmPassword?.markAsDirty();
        });
        it('should return false if password is invalid', () => {
          loginComponent.confirmPassword?.setValue('111111');
          expect(loginComponent.checkFormEquality()).toBe(false);
        });
        it('should return false if confirmPassword is invalid', () => {
          loginComponent.password?.setValue('111111');
          expect(loginComponent.checkFormEquality()).toBe(false);
        });
      });
    });

    describe('toggleHidePass', () => {
      it('should toggle hidePass value', () => {
        loginComponent.isPassHidden.set(true);
        loginComponent.toggleIsPassHidden();
        expect(loginComponent.isPassHidden()).toBe(false);
      });
    });
    describe('toggleHideConfirmPass', () => {
      it('should toggle hideConfirmPass value', () => {
        loginComponent.isConfirmPassHidden.set(true);
        loginComponent.toggleIsConfirmPassHidden();
        expect(loginComponent.isConfirmPassHidden()).toBe(false);
      });
    });
    describe('toggleStatus', () => {
      it('should toggle status value to register', () => {
        loginComponent.status.set('login');
        loginComponent.toggleStatus();
        expect(loginComponent.status()).toBe('register');
      });
      it('should toggle status value to login', () => {
        loginComponent.status.set('register');
        loginComponent.toggleStatus();
        expect(loginComponent.status()).toBe('login');
      });
      describe('when status value is register', () => {
        let controlKeys: string[] = [];
        beforeEach(() => {
          loginComponent.status.set('login');
          loginComponent.toggleStatus();
          controlKeys = Object.keys(loginComponent.loginForm.controls);
        });
        it('should add fullName control to loginForm', () => {
          expect(controlKeys).toContain('fullName');
        });
        it('should add confirmPassword control to loginForm', () => {
          expect(controlKeys).toContain('confirmPassword');
        });
      });
      describe('when status value is login', () => {
        let controlKeys: string[] = [];
        beforeEach(() => {
          loginComponent.status.set('register');
          loginComponent.toggleStatus();
          controlKeys = Object.keys(loginComponent.loginForm.controls);
        });
        it('should remove fullName control from loginForm', () => {
          expect(controlKeys).not.toContain('fullName');
        });
        it('should remove confirmPassword control from loginForm', () => {
          expect(controlKeys).not.toContain('confirmPassword');
        });
      });
    });
    describe('submit', () => {
      beforeEach(() => {
        vi.spyOn(loginComponent, 'login').mockImplementation(() => {});
        vi.spyOn(loginComponent, 'register').mockImplementation(() => {});
      });
      describe('when status is login', () => {
        it('should execute login function', () => {
          loginComponent.status.set('login');
          loginComponent.submit();
          expect(loginComponent.login).toHaveBeenCalledOnce();
          expect(loginComponent.register).not.toHaveBeenCalled();
        });
      });
      describe('when status is register', () => {
        it('should execute register function', () => {
          loginComponent.status.set('register');
          loginComponent.submit();
          expect(loginComponent.register).toHaveBeenCalledOnce();
          expect(loginComponent.login).not.toHaveBeenCalled();
        });
      });
    });
    describe('login', () => {
      describe('when loginForm.valid', () => {
        beforeEach(() => {
          loginComponent.email?.setValue('e@e.com');
          loginComponent.password?.setValue('123456');
        });
        describe('when API call succeeds', () => {
          beforeEach(() => {
            mockAuthService.login.mockReturnValue(of({ user: { uid: '123' } }));
            loginComponent.login();
          });
          it('should call authService.login once', () => {
            expect(mockAuthService.login).toHaveBeenCalledOnce();
          });
          it('should call authService.login with loginForm.value', () => {
            const loginData = loginComponent.loginForm.value;
            expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
          });
          it('should call authService.setUserId with "uid"', () => {
            expect(mockAuthService.setUserId).toHaveBeenCalledWith('123');
          });
          it('should navigate to home', () => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
          });
        });
        describe('when API call fails', () => {
          it('should display snakBar.open with expected message', () => {
            mockAuthService.login.mockReturnValue(throwError(() => new Error('server error')));
            loginComponent.login();
            expect(mockMatSnackBar.open).toHaveBeenCalledWith(
              'Please try again later',
              'Close',
              snakBarConfig,
            );
          });
        });
      });
      describe('when loginForm.invalid', () => {
        it('should not call authService.login', () => {
          loginComponent.login();
          expect(mockAuthService.login).not.toHaveBeenCalled();
        });
      });
    });
    describe('register', () => {
      describe('when loginForm.valid', () => {
        beforeEach(() => {
          loginComponent.fullName?.setValue('first user');
          loginComponent.email?.setValue('e@e.com');
          loginComponent.password?.setValue('123456');
          loginComponent.confirmPassword?.setValue('123456');
        });
        describe('when API call succeeds', () => {
          beforeEach(() => {
            mockAuthService.register.mockReturnValue(of({ user: { uid: '123' } }));
            loginComponent.register();
          });
          it('should call authService.register once', () => {
            expect(mockAuthService.register).toHaveBeenCalledOnce();
          });
          it('should call authService.register with correct parameters', () => {
            const formValue = loginComponent.loginForm.value;
            expect(mockAuthService.register).toHaveBeenCalledWith(formValue);
          });
          it('should call authService.setUserId with uid', () => {
            expect(mockAuthService.setUserId).toHaveBeenCalledWith('123');
          });
          it('should navigate to home', () => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
          });
        });
        describe('when API call fails', () => {
          it('should call snakBar.open with expected message', () => {
            mockAuthService.register.mockReturnValue(throwError(() => new Error('server error')));
            loginComponent.register();
            expect(mockMatSnackBar.open).toHaveBeenCalledWith(
              'Please try again later',
              'Close',
              snakBarConfig,
            );
          });
        });
      });

      describe('when loginForm.invalid', () => {
        it('should not call authService.register', () => {
          loginComponent.register();
          expect(mockAuthService.register).not.toHaveBeenCalled();
        });
      });
    });
  });
  describe('DOM rendering', () => {
    let loader: HarnessLoader;

    beforeEach(() => {
      loader = TestbedHarnessEnvironment.loader(fixture);
      debugElement = fixture.debugElement;
    });
    it('should render the form', () => {
      const formDebugElement = debugElement.query(By.css('form'));
      expect(formDebugElement).toBeTruthy();
    });
    describe('when status is login', () => {
      it('should display "Login" text', () => {
        expect(debugElement.nativeElement.textContent).toContain('Login');
      });
      it('should display email form field', async () => {
        const emailInput = await loader.getHarness(
          MatInputHarness.with({ selector: 'input[formControlName="email"]' }),
        );
        expect(emailInput).toBeTruthy();
      });
      it('should display password form field', async () => {
        const passwordInput = await loader.getHarness(
          MatInputHarness.with({ selector: 'input[formControlName="password"]' }),
        );
        expect(passwordInput).toBeTruthy();
      });
      it('should not display fullname form field', async () => {
        const fullNameInput = await loader.getHarnessOrNull(
          MatInputHarness.with({ selector: 'input[formControlName="fullName"]' }),
        );

        expect(fullNameInput).toBeNull();
      });

      it('should not display confirmPassword form field', async () => {
        const confirmPasswordInput = await loader.getHarnessOrNull(
          MatInputHarness.with({ selector: 'input[formControlName="confirmPassword"]' }),
        );
        expect(confirmPasswordInput).toBeNull();
      });

      describe('email form field', () => {
        let emailFormField: DebugElement;
        beforeEach(() => {
          emailFormField = debugElement.query(
            By.css('mat-form-field:has(input[formControlName="email" ])'),
          );
        });
        it('should display a label', () => {
          const matLabel = emailFormField.query(By.css('mat-label'));
          expect(matLabel).toBeTruthy();
          expect(matLabel.nativeElement.textContent).toContain('email');
        });
        describe('when touched and hasError', () => {
          beforeEach(() => {
            loginComponent.email?.markAsTouched();
            fixture.detectChanges();
          });
          it('should display a required error message', () => {
            const matError = emailFormField.query(By.css('mat-error'));
            expect(matError).toBeTruthy();
            expect(matError.nativeElement.textContent).toContain('required');
          });
          it('should display a pattern error message', () => {
            loginComponent.email?.setValue('e');
            fixture.detectChanges();
            const matError = emailFormField.query(By.css('mat-error'));
            expect(matError).toBeTruthy();
            expect(matError.nativeElement.textContent).toContain('valid');
          });
        });
      });

      describe('password form field', () => {
        let passwordFormFieldLoader: HarnessLoader;
        let passwordFormFieldHarness: MatFormFieldHarness;
        let inputHarness: MatInputHarness;
        let toggleButtonHarness: MatButtonHarness;
        beforeEach(async () => {
          passwordFormFieldLoader = await loader.getChildLoader(
            'mat-form-field:has(input[formControlName="password"])',
          );
          passwordFormFieldHarness = await loader.getHarness(
            MatFormFieldHarness.with({
              selector: ':has(input[formControlName="password"])',
            }),
          );
          inputHarness = await passwordFormFieldLoader.getHarness(MatInputHarness);
          toggleButtonHarness = await passwordFormFieldLoader.getHarness(MatButtonHarness);
        });
        it('should contain a label', async () => {
          const label = await passwordFormFieldHarness.getLabel();
          expect(label).toContain('password');
        });
        it('should have type password initially', async () => {
          const matInputType = await inputHarness.getType();
          expect(matInputType).toBe('password');
        });

        // describe('toggle button', () => {
        //   let input: DebugElement;
        //   let matFormField: HTMLElement;
        //   let button: HTMLButtonElement | null;

        //   beforeEach(() => {
        //     input = debugElement.query(By.css('input[formControlName="password"]'));
        //     matFormField = input.nativeElement.closest('mat-form-field') as HTMLElement;
        //     button = matFormField.querySelector('button');
        //   });

        //   it('should contain toggle input type button', async () => {
        //     expect(button).toBeTruthy();
        //   });

        //   it('should change input type when clicked', () => {
        //     button?.dispatchEvent(new Event('click'));
        //     fixture.detectChanges();
        //     expect(input.nativeElement.type).toBe('text');
        //   });
        // });

        describe('toggle button', () => {
          it('should change input type when clicked', async () => {
            await toggleButtonHarness.click();
            const type = await inputHarness.getType();
            expect(type).toBe('text');
          });
          it('should toggle aria-pressed when clicked', async () => {
            const host = await toggleButtonHarness.host();
            expect(await host.getAttribute('aria-pressed')).toBe('false');
            await toggleButtonHarness.click();
            expect(await host.getAttribute('aria-pressed')).toBe('true');
          });
          it('should display visibility_off icon initially', async () => {
            const iconHarness = await passwordFormFieldLoader.getHarness(MatIconHarness);
            const iconName = await iconHarness.getName();
            expect(iconName).toBe('visibility_off');
          });
          it('should display visibility icon after click', async () => {
            await toggleButtonHarness.click();
            const iconHarness = await passwordFormFieldLoader.getHarness(MatIconHarness);
            const iconName = await iconHarness.getName();
            expect(iconName).toBe('visibility');
          });
        });
        describe('when touched and hasError', () => {
          it('should display a required error message', async () => {
            loginComponent.password?.markAsTouched();
            const errors = await passwordFormFieldHarness.getErrors();
            expect(errors.length).toBe(1);
            expect(await errors[0].getText()).toContain('required');
          });
          it('should display a pattern error message', async () => {
            loginComponent.password?.markAsTouched();
            loginComponent.password?.setValue('123');
            const errors = await passwordFormFieldHarness.getErrors();
            expect(errors.length).toBe(1);
            expect(await errors[0].getText()).toContain('valid');
          });
        });
      });
    });
    describe('when status is register', () => {
      let fullNameHarness: MatFormFieldHarness;
      let confirmPassLoader: HarnessLoader;
      let confirmPassHarness: MatFormFieldHarness;
      beforeEach(async () => {
        loginComponent.toggleStatus();
        fixture.detectChanges();
        fullNameHarness = await loader.getHarness(
          MatFormFieldHarness.with({
            selector: 'mat-form-field:has(input[formControlName="fullName"])',
          }),
        );
        confirmPassLoader = await loader.getChildLoader(
          'mat-form-field:has(input[formControlName="confirmPassword"])',
        );
        confirmPassHarness = await loader.getHarness(
          MatFormFieldHarness.with({
            selector: 'mat-form-field:has(input[formControlName="confirmPassword"])',
          }),
        );
      });
      it('should display fullname form field', () => {
        expect(fullNameHarness).toBeTruthy();
      });
      it('should display confirmPassword form field', () => {
        expect(confirmPassHarness).toBeTruthy();
      });
      describe('full name', () => {
        it('should contain a label', async () => {
          const label = await fullNameHarness.getLabel();
          expect(label).toContain('name');
        });

        describe('when touched and hasError', () => {
          beforeEach(() => {
            loginComponent.fullName?.markAsTouched();
          });
          it('should display a required error message', async () => {
            const errors = await fullNameHarness.getErrors();
            expect(await errors[0].getText()).toContain('required');
          });
          it('should display an invalid error message', async () => {
            loginComponent.fullName?.setValue('123');
            const errors = await fullNameHarness.getErrors();
            expect(await errors[0].getText()).toContain('valid');
          });
        });
        describe('when untouched and hasError', () => {
          it('should not display a required error message', async () => {
            expect.assertions(3);
            expect(loginComponent.fullName?.hasError('required')).toBe(true);
            expect(loginComponent.fullName?.untouched).toBe(true);
            expect(await fullNameHarness.getErrors()).toEqual([]);
          });
          it('should not display an invalid error message', async () => {
            expect.assertions(3);
            loginComponent.fullName?.setValue('123');
            expect(loginComponent.fullName?.hasError('pattern')).toBe(true);
            expect(loginComponent.fullName?.untouched).toBe(true);
            expect(await fullNameHarness.getErrors()).toEqual([]);
          });
        });
      });
      describe('confirm password', () => {
        let inputHarness: MatInputHarness;
        beforeEach(async () => {
          inputHarness = await confirmPassLoader.getHarness(MatInputHarness);
        });

        it('should contain a label', async () => {
          expect(await confirmPassHarness.getLabel()).toBe('confirm your password');
        });

        it('should be a type password initially', async () => {
          expect(await inputHarness.getType()).toBe('password');
        });

        describe('toggle button', () => {
          let toggleButtonHarness: MatButtonHarness;
          beforeEach(async () => {
            toggleButtonHarness = await confirmPassLoader.getHarness(MatButtonHarness);
          });
          it('should toggle input type when clicked', async () => {
            expect.assertions(2);
            expect(await inputHarness.getType()).toBe('password');
            await toggleButtonHarness.click();
            expect(await inputHarness.getType()).toBe('text');
          });
          it('should return to type password when clicked twice', async () => {
            expect.assertions(2);

            expect(await inputHarness.getType()).toBe('password');
            await toggleButtonHarness.click();
            await toggleButtonHarness.click();
            expect(await inputHarness.getType()).toBe('password');
          });
          describe('aria-label', () => {
            let host: TestElement;
            beforeEach(async () => {
              host = await toggleButtonHarness.host();
            });
            it('should contain aria-label "show password" initially', async () => {
              expect(await host.getAttribute('aria-label')).toBe('show password');
            });
            it('should toggle aria-label to "hide password" when click', async () => {
              await toggleButtonHarness.click();
              expect(await host.getAttribute('aria-label')).toBe('hide password');
            });
          });
          describe('aria-pressed', () => {
            let host: TestElement;
            beforeEach(async () => {
              host = await toggleButtonHarness.host();
            });
            it('should contain aria-pressed "false" initially', async () => {
              expect(await host.getAttribute('aria-pressed')).toBe('false');
            });
            it('should toggle aria-pressed to "true" when click', async () => {
              await toggleButtonHarness.click();
              expect(await host.getAttribute('aria-pressed')).toBe('true');
            });
          });
          describe('mat icon', () => {
            let icon: MatIconHarness;
            beforeEach(async () => {
              icon = await confirmPassLoader.getHarness(MatIconHarness);
            });
            it('should contain visibility_off icon initially', async () => {
              expect(await icon.getName()).toBe('visibility_off');
            });
            it('should change icon to visibility when isConfirmPassHidden changed', async () => {
              await toggleButtonHarness.click();
              expect(await icon.getName()).toBe('visibility');
            });
          });
        });
        describe('when touched and hasError', () => {
          it('should display a required error message', async () => {
            loginComponent.confirmPassword?.markAsTouched();
            expect(await confirmPassHarness.getTextErrors()).toEqual([
              'Confirm password is required',
            ]);
          });
          it('should display an invalid error message', async () => {
            loginComponent.confirmPassword?.markAsTouched();
            loginComponent.confirmPassword?.setValue('123');
            expect(await confirmPassHarness.getTextErrors()).toEqual([
              'Please enter a valid password',
            ]);
          });
        });
        describe('when untouched and hasError', () => {
          it('should not display a required error message', async () => {
            expect.assertions(3);
            expect(loginComponent.confirmPassword?.untouched).toBe(true);
            expect(loginComponent.confirmPassword?.hasError('required')).toBe(true);
            expect(await confirmPassHarness.getTextErrors()).toEqual([]);
          });
          it('should not display an invalid error message', async () => {
            expect.assertions(3);
            loginComponent.confirmPassword?.setValue('123');
            expect(loginComponent.confirmPassword?.untouched).toBe(true);
            expect(loginComponent.confirmPassword?.hasError('pattern')).toBe(true);
            expect(await confirmPassHarness.getTextErrors()).toEqual([]);
          });
        });
      });
    });
    describe('password mismatch message', () => {
      let passwordInputHarness: MatInputHarness;
      let confirmPasswordInputHarness: MatInputHarness;
      const equalityErrorMessage = 'Password and Confirm password must be equal';

      const getMismatchError = () =>
        loader.getHarnessOrNull(PasswordMismatchHarness.with({ text: equalityErrorMessage }));

      const hasMismatchError = () => loginComponent.loginForm.hasError('passwordMismatch');
      beforeEach(async () => {
        loginComponent.toggleStatus();

        passwordInputHarness = await loader.getHarness(
          MatInputHarness.with({ selector: 'input[formControlName="password"]' }),
        );
        confirmPasswordInputHarness = await loader.getHarness(
          MatInputHarness.with({ selector: 'input[formControlName="confirmPassword"]' }),
        );
      });

      describe('when password and confirmPass are valid', () => {
        it('should display an error message if they are not equal', async () => {
          await passwordInputHarness.setValue('123456');
          await confirmPasswordInputHarness.setValue('111111');
          expect(await getMismatchError()).not.toBeNull();
        });

        it('should not display an error message if they are equal', async () => {
          await passwordInputHarness.setValue('123456');
          await confirmPasswordInputHarness.setValue('123456');
          expect(await getMismatchError()).toBeNull();
        });
      });
      describe('when password or confirmPass are not valid', () => {
        it('should not display an equality error message if password is not valid', async () => {
          expect.assertions(2);
          await passwordInputHarness.setValue('123');
          await confirmPasswordInputHarness.setValue('111111');
          expect(hasMismatchError()).toBe(true);
          expect(await getMismatchError()).toBeNull();
        });
        it('should not display an equality error message if confirm password is not valid', async () => {
          expect.assertions(2);
          await passwordInputHarness.setValue('123456');
          await confirmPasswordInputHarness.setValue('111');
          expect(hasMismatchError()).toBe(true);
          expect(await getMismatchError()).toBeNull();
        });
      });
      describe('when password and confirmPass equality status changes', () => {
        it('should clear the passwordMismatch validation error when values become equal', async () => {
          expect.assertions(2);
          await passwordInputHarness.setValue('123456');
          await confirmPasswordInputHarness.setValue('111111');
          expect(hasMismatchError()).toBe(true);
          await confirmPasswordInputHarness.setValue('123456');
          expect(hasMismatchError()).toBe(false);
        });
        it('should hide the error message when valid values get equal', async () => {
          expect.assertions(2);
          await passwordInputHarness.setValue('123456');
          await confirmPasswordInputHarness.setValue('111111');
          expect(await getMismatchError()).not.toBeNull();
          await confirmPasswordInputHarness.setValue('123456');
          expect(await getMismatchError()).toBeNull();
        });
      });
    });

    describe('submit button', () => {
      let submitBtnHarness: MatButtonHarness;
      let emailInput: MatInputHarness;
      let passwordInput: MatInputHarness;

      beforeEach(async () => {
        submitBtnHarness = await loader.getHarness(
          MatButtonHarness.with({
            // selector: `button[disabled=${loginComponent.loginForm.invalid}]`,
            selector: `button[type="submit"]`,
          }),
        );

        emailInput = await loader.getHarness(
          MatInputHarness.with({ selector: 'input[formControlName="email"]' }),
        );
        passwordInput = await loader.getHarness(
          MatInputHarness.with({ selector: 'input[formControlName="password"]' }),
        );
      });

      describe('when status is login', () => {
        it('should display "login" as its text', async () => {
          expect(await submitBtnHarness.getText()).toBe('login');
        });
        describe('when the form is invalid', () => {
          it('should be disabled', async () => {
            expect.assertions(2);
            expect(loginComponent.loginForm.invalid).toBe(true);
            expect(await submitBtnHarness.isDisabled()).toBe(true);
          });
        });
        describe('when the form is valid', () => {
          let fillValidLoginForm: () => Promise<void>;
          beforeEach(() => {
            fillValidLoginForm = async () => {
              await emailInput.setValue('example@gmail.com');
              await passwordInput.setValue('123456');
            };
          });
          it('should be enabled', async () => {
            expect.assertions(2);
            await fillValidLoginForm();
            expect(loginComponent.loginForm.valid).toBe(true);
            expect(await submitBtnHarness.isDisabled()).toBe(false);
          });
          it('should call authService.login with the form value when clicked', async () => {
            expect.assertions(3);
            mockAuthService.login.mockReturnValue(of({ user: { uid: '123' } }));
            await fillValidLoginForm();
            expect(loginComponent.loginForm.valid).toBe(true);
            await submitBtnHarness.click();
            expect(mockAuthService.login).toHaveBeenCalledOnce();
            expect(mockAuthService.login).toHaveBeenCalledWith({
              email: 'example@gmail.com',
              password: '123456',
            });
          });
        });
      });

      describe('when status is register', () => {
        let fillRegisterForm: (confirmPassValue: string) => Promise<void>;
        beforeEach(() => {
          loginComponent.toggleStatus();
          fillRegisterForm = async (confirmPassValue: string) => {
            const fullNameInput = await loader.getHarness(
              MatInputHarness.with({ selector: 'input[formControlName="fullName"]' }),
            );
            const confirmPasswordInput = await loader.getHarness(
              MatInputHarness.with({ selector: 'input[formControlName="confirmPassword"]' }),
            );
            await fullNameInput.setValue('unknown');
            await emailInput.setValue('example@gmail.com');
            await passwordInput.setValue('123456');
            await confirmPasswordInput.setValue(confirmPassValue);
          };
        });
        it('should display "register" as its text', async () => {
          expect(await submitBtnHarness.getText()).toBe('register');
        });
        describe('when the form is invalid', () => {
          it('should be disabled', async () => {
            expect.assertions(2);
            expect(loginComponent.loginForm.invalid).toBe(true);
            expect(await submitBtnHarness.isDisabled()).toBe(true);
          });
          it('should be disabled when the passwords do not match', async () => {
            expect.assertions(2);
            await fillRegisterForm('111111');
            expect(loginComponent.loginForm.hasError('passwordMismatch')).toBe(true);
            expect(await submitBtnHarness.isDisabled()).toBe(true);
          });
        });
        describe('when the form is valid', () => {
          it('should be enabled', async () => {
            await fillRegisterForm('123456');
            expect(await submitBtnHarness.isDisabled()).toBe(false);
          });
          it('should call authService.register with the form value when clicked', async () => {
            expect.assertions(3);
            mockAuthService.register.mockReturnValue(of({ user: { uid: '123' } }));
            await fillRegisterForm('123456');
            await submitBtnHarness.click();
            expect(loginComponent.loginForm.valid).toBe(true);
            expect(mockAuthService.register).toHaveBeenCalledOnce();
            expect(mockAuthService.register).toHaveBeenCalledWith({
              fullName: 'unknown',
              email: 'example@gmail.com',
              password: '123456',
              confirmPassword: '123456',
            });
          });
        });
      });
    });
    describe('toggle status button', () => {
      let statusTogglerButton: DebugElement;
      let getTextContent: () => string;
      beforeEach(() => {
        statusTogglerButton = debugElement.query(By.css('button[id="toggleStatusButton"]'));

        getTextContent = () => statusTogglerButton.nativeElement.textContent.trim();
      });
      it('should be exist', () => {
        expect(statusTogglerButton).not.toBeNull();
      });
      it('should toggle status when clicked', () => {
        expect.assertions(2);
        expect(loginComponent.status()).toBe('login');
        statusTogglerButton.nativeElement.click();
        expect(loginComponent.status()).toBe('register');
      });
      it('should return to login status when clicked twice', () => {
        expect.assertions(2);
        expect(loginComponent.status()).toBe('login');
        statusTogglerButton.nativeElement.click();
        statusTogglerButton.nativeElement.click();
        expect(loginComponent.status()).toBe('login');
      });

      it('should display "Already Have An Account" after being clicked', () => {
        expect.assertions(2);
        expect(getTextContent()).toBe('Create An Account');
        statusTogglerButton.nativeElement.click();
        fixture.detectChanges();
        expect(getTextContent()).toBe('Already Have An Account');
      });

      it('should display "Create An Account" after being clicked twice', () => {
        expect.assertions(2);
        expect(getTextContent()).toBe('Create An Account');

        statusTogglerButton.nativeElement.click();
        fixture.detectChanges();
        statusTogglerButton.nativeElement.click();
        fixture.detectChanges();

        expect(getTextContent()).toBe('Create An Account');
      });
    });
  });
});
