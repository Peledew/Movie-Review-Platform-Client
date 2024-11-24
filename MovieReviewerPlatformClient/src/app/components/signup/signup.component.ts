import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      console.log('Form Submitted', this.signUpForm.value);
      // Perform login logic here
    } else {
      console.log('Form is invalid');
    }
  }

  navigateToLogIn() {
    this.router.navigate(['login']);
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      console.log('Signed Up!!', this.signUpForm.value);

      this.auth.signUp(this.signUpForm.value).subscribe({
        next: (res) => {
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.log(err?.error.message);
        },
      });
    } else {
      console.log('Sign Up FAILED');
    }
  }
}
