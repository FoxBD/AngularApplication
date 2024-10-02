import {Component, OnChanges, OnInit} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {User} from "../models/user";
import {ToastService} from "../toast/toast.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  user: User[] = []
  token: string = "";

  constructor(private authService: AuthService, private router: Router, public toastService: ToastService) {}

  ngOnInit() {
    //this.testLogin();
  }

  // Method to handle form submission
  testLogin() {
    this.authService.login("admin@admin.com", "admin").subscribe(response => {
      this.toastService.add(response.token, 2000, 'success');
    })
  }

  login() {
    let bothFilled = true;
    const emailElement = document.getElementById('email') as HTMLInputElement;
    if (!emailElement.value) { bothFilled = false; }
    const passwordElement = document.getElementById('password') as HTMLInputElement;
    if (!passwordElement.value) { bothFilled = false; }

    if (bothFilled) {
      this.authService.login(emailElement.value, passwordElement.value).subscribe({
        next: (response) => {
          this.authService.saveToken(response);
          this.router.navigate(['']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.toastService.add('Invalid login credentials. Please try again.', 2000, 'error');
          } else {
            this.toastService.add('An unexpected error occurred. Please try again later.', 2000, 'error');
          }
        }
      })
    } else {
      this.toastService.add('One of credentials not filled', 2000, 'error');
    }
  }
}
