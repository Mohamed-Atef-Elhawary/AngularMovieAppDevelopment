import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],

  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  status = signal<'login' | 'register'>('login');

  toggleStatusText = computed<string>(() => {
    return this.status() === 'login' ? 'Create An Account' : 'Already Have An Account';
  });

  hidePass = signal(true);
  hideConfirmPass = signal(true);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.makeForm();
  }

  makeForm() {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.pattern(/^\w+@\w+\.\w{1,5}$/)]],
        password: ['', [Validators.required, Validators.pattern(/^\S.{4,}\S$/)]],
      },
      { validators: this.isEqual.bind(this) },
    );
  }

  isEqual(form: AbstractControl): ValidationErrors | null {
    let pass = form.get('password');
    let confirmPass = form.get('confirmPassword');
    if (pass && confirmPass) {
      let validationErrors = { passwordMismatch: true };
      return pass.value === confirmPass.value ? null : validationErrors;
    }
    return null;
  }
  checkFormEquality(): boolean {
    let dirtyPass = this.password?.valid && this.password?.dirty;
    let dirtyConfirmPass = this.confirmPassword?.valid && this.confirmPassword?.dirty;
    return (dirtyPass && dirtyConfirmPass) || false;
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get fullName() {
    return this.loginForm.get('fullName');
  }
  get confirmPassword() {
    return this.loginForm.get('confirmPassword');
  }

  toggleHidePass() {
    this.hidePass.update((v) => !v);
  }
  toggleHideConfirmPass() {
    this.hideConfirmPass.update((v) => !v);
  }

  toggleSatatus() {
    this.status.update((state: 'login' | 'register') => {
      return state === 'login' ? 'register' : 'login';
    });
    this.modifyForm();
  }
  modifyForm() {
    if (this.status() === 'register') {
      this.loginForm.addControl(
        'fullName',
        this.fb.control('', [Validators.required, Validators.pattern(/^([a-z]\s?)+$/i)]),
      );
      this.loginForm.addControl(
        'confirmPassword',
        this.fb.control('', [Validators.required, Validators.pattern(/^\S.{4,}\S$/)]),
      );
    } else {
      this.loginForm.removeControl('fullName');
      this.loginForm.removeControl('confirmPassword');
    }
  }

  submit() {
    console.log('submit callllllllllllllled');
    if (this.status() == 'login') {
      this.login();
    } else {
      this.register();
    }
  }
  login() {
    console.log('login callllllllllllllled');
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.setUserId(response.user.uid);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.log('err', err);
        },
      });
    }
  }
  register() {
    console.log('register callllllllllllllled');

    if (this.loginForm.valid) {
      this.authService.register(this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.setUserId(response.user.uid);
          this.authService.clearLocalStorage();
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.log('err', err);
        },
      });
    }
  }
}
