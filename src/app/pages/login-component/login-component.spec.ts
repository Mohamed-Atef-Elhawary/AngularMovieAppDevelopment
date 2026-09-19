import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login-component';
import { Mock } from 'vitest';
import { AuthService } from '../../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { snakBarConfig } from '../../config/snakbar-config';
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

describe('LoginComponent', () => {
  let loginComponent: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
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
    await fixture.whenStable();
    fixture.detectChanges();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
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
      loginComponent.hidePass.set(true);
      loginComponent.toggleHidePass();
      expect(loginComponent.hidePass()).toBe(false);
    });
  });
  describe('toggleHideConfirmPass', () => {
    it('should toggle hideConfirmPass value', () => {
      loginComponent.hideConfirmPass.set(true);
      loginComponent.toggleHideConfirmPass();
      expect(loginComponent.hideConfirmPass()).toBe(false);
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
  // describe('register', () => {});
});
