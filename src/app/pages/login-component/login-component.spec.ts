import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login-component';
import { Mock } from 'vitest';
import { AuthService } from '../../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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

  beforeEach(async () => {
    const spyAuthService: AuthServiceInterface = {
      login: vi.fn(),
      register: vi.fn(),
      setUserId: vi.fn(),
    };
    const spyMatSnackBar: MatSnackBarInterface = {
      open: vi.fn(),
    };
    const spyRouter: RouterInterface = {
      navigate: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: spyAuthService },
        { provide: MatSnackBar, useValue: spyMatSnackBar },
        { provide: Router, useValue: spyRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    loginComponent = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
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
});
