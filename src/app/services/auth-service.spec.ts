import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}));
describe('AuthService', () => {
  const mockRouter = {
    navigate: vi.fn(),
  };
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: mockRouter }] });
    authService = TestBed.inject(AuthService);
    localStorage.setItem('uid', 'user1');
  });

  it('should craete', () => {
    expect(authService).toBeTruthy();
  });
  describe('getUserId', () => {
    it('should initialize "uid" with localStorage item', () => {
      expect(authService.uid()).toBe('user1');
    });
  });

  describe('setUserId', () => {
    beforeEach(() => {
      authService.setUserId('user2');
    });
    it('should set uid signal with the received parameter', () => {
      expect(authService.uid()).toBe('user2');
    });
    it('should set the received parameter to localStorage', () => {
      expect(localStorage.getItem('uid')).toBe('user2');
    });
  });

  describe('register', () => {
    describe('when API call succeeds', () => {
      it('should call createUser with correct email and password', () => {});
      it('should call updateProfile with correct fullName', () => {});
      it('should call reload once', () => {});
      it('should create a new user with email, password, fullName', () => {});
    });
    describe('when API call fails', () => {
      it('should emit an error to subscribers', () => {});
      it('should not call updateProfile if createUser fails', () => {});
    });
  });

  // describe('login', () => {
  //   it('', () => {});
  // });
});
