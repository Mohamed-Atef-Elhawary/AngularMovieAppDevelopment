import { Injectable, signal } from '@angular/core';
import { Observable, from, map, of, switchMap } from 'rxjs';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  Auth,
  updateProfile,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = getAuth();
  uid = signal<string | null>(this.getUserId());

  getUserId(): string | null {
    return localStorage.getItem('uid');
  }
  setUserId(userId: string): void {
    this.uid.set(userId);
    localStorage.setItem('uid', userId);
  }

  clearLocalStorage() {
    localStorage.removeItem('favImdbIDList');
  }
  register(registerData: {
    email: string;
    password: string;
    fullName: string;
  }): Observable<UserCredential> {
    const { email, password, fullName } = registerData;

    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) =>
        from(updateProfile(userCredential.user, { displayName: fullName })).pipe(
          switchMap(() => from(userCredential.user.reload())),
          map(() => userCredential),
        ),
      ),
    );
  }

  login(loginData: { email: string; password: string }): Observable<UserCredential> {
    let { email, password } = loginData;
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }
}
