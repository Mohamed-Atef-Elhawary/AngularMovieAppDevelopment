import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { Mock } from 'vitest';
import { firstValueFrom, of } from 'rxjs';

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
  const mockCreateUserWithEmailAndPassword = createUserWithEmailAndPassword as Mock;
  const mockSignInWithEmailAndPassword = signInWithEmailAndPassword as Mock;
  const mockGetAuth = getAuth as Mock;
  const mockUpdateProfile = updateProfile as Mock;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: mockRouter }] });
    mockGetAuth.mockReturnValue({});
    authService = TestBed.inject(AuthService);
    localStorage.setItem('uid', 'user1');
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
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
    const registerData = { email: 'E1@g.com', password: '123', fullName: 'userFullName' };
    const act = () => firstValueFrom(authService.register(registerData));
    describe('when API call succeeds', () => {
      let mockReload: Mock;
      let userCredential: unknown;
      beforeEach(() => {
        mockReload = vi.fn().mockResolvedValue(undefined);
        userCredential = { user: { reload: mockReload } };
        mockCreateUserWithEmailAndPassword.mockResolvedValue(userCredential);
        mockUpdateProfile.mockResolvedValue({});
      });
      it('should call createUser with correct email and password', async () => {
        await act();
        expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith({}, 'E1@g.com', '123');
      });
      it('should call updateProfile with correct fullName', async () => {
        await act();
        expect(mockUpdateProfile).toHaveBeenCalledWith(
          { reload: expect.anything() },
          { displayName: 'userFullName' },
        );
      });
      it('should call reload once', async () => {
        await act();
        expect(mockReload).toHaveBeenCalledTimes(1);
      });
      it('should create a new user with email, password, fullName', async () => {
        const newUser = await act();
        expect(newUser).toBe(userCredential);
      });
    });
    describe('when API call fails', () => {
      beforeEach(() => {
        mockCreateUserWithEmailAndPassword.mockRejectedValue(new Error('network error'));
      });
      // it('should emit an error to subscribers', async () => {
      //   try {
      //     const receivedvalue = await act();
      //     expect.fail('should have thrown');
      //   } catch (err: any) {
      //     expect(err.message).toBe('network error');
      //   }
      // });
      it('should emit an error to subscribers', async () => {
        await expect(firstValueFrom(authService.register(registerData))).rejects.toThrow(
          'network error',
        );
      });
    });
  });

  describe('login', () => {
    const requestLoginData = { email: 'e@g.com', password: '123' };
    const responseLoginData = { logIn: true };
    describe('when API call succeeds', () => {
      beforeEach(() => {
        mockSignInWithEmailAndPassword.mockResolvedValue({ logIn: true });
      });
      it('should call signInWithEmailAndPassword with correct email and password', async () => {
        await firstValueFrom(authService.login(requestLoginData));
        expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith({}, 'e@g.com', '123');
      });
      it('should return UserCredential object to subscribers', async () => {
        const userCredential = await firstValueFrom(authService.login(requestLoginData));
        expect(userCredential).toEqual(responseLoginData);
      });
    });
    describe('when API call fails', () => {
      it('should return an error to subscribers', async () => {
        const firebaseError = Object.assign(
          new Error('Firebase: Error (auth/network-request-failed).'),
          {
            code: 'auth/network-request-failed',
          },
        );
        mockSignInWithEmailAndPassword.mockRejectedValue(firebaseError);
        await expect(firstValueFrom(authService.login(requestLoginData))).rejects.toBe(
          firebaseError,
        );
      });
    });
  });
  describe('logout', () => {
    beforeEach(() => {
      localStorage.setItem('index', 'someValue');
      authService.logout();
    });
    it('should remove "index","uid" from localStorage', () => {
      expect(localStorage.getItem('index')).toBeNull();
      expect(localStorage.getItem('uid')).toBeNull();
    });
    it('should call navigate with "/login" parameter', () => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
    it('should set "uid" to null', () => {
      expect(authService.uid()).toBeNull();
    });
  });
});
