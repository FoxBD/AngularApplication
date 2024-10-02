import {Component, OnInit} from '@angular/core';
import {User} from "../models/user";
import {AuthService} from "../service/auth.service";
import {Router} from "@angular/router";
import {ToastService} from "../toast/toast.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AppService} from "../service/app.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  user: User = {}
  token: string = "";
  userId: string = "";
  checkboxValue?: boolean = false;

  constructor(private authService: AuthService, private appService: AppService, private router: Router, public toastService: ToastService) {}

  ngOnInit() {
    //this.testLogin();
    const fullPath = this.router.url.split('/')
    if (fullPath[1] === 'user-edit') {
      this.userId = fullPath[2]
      this.adminEditing()
    }
  }

  adminEditing(): void {
    this.appService.getOneUser(this.userId).subscribe((response)=> {
      this.user = response;
      this.checkboxValue = response.admin;
      console.log(this.user);
    })
  }

  // Method to handle form submission
  testLogin() {
    this.authService.login("admin@admin.com", "admin").subscribe(response => {
      this.toastService.add(response.token, 2000, 'success');
    })
  }

  register() {
    let allFilled = true;
    const nameElement = document.getElementById('name') as HTMLInputElement;
    if (!nameElement.value) { allFilled = false; }
    const surnameElement = document.getElementById('surname') as HTMLInputElement;
    if (!surnameElement.value) { allFilled = false; }
    const emailElement = document.getElementById('email') as HTMLInputElement;
    if (!emailElement.value) { allFilled = false; }
    const passwordElement = document.getElementById('password') as HTMLInputElement;
    if (!passwordElement.value) { allFilled = false; }
    const telephoneElement = document.getElementById('telephone') as HTMLInputElement;
    if (!telephoneElement.value) { allFilled = false; }

    if (allFilled) {
      if (!this.userId) {
        this.authService.register(nameElement.value, surnameElement.value,emailElement.value, passwordElement.value, telephoneElement.value).subscribe({
          next: (response) => {
            this.toastService.add('User created, welcome ' + nameElement.value, 2000, 'success');
            this.router.navigate(['/login']);
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.toastService.add('Invalid register credentials. Please try again.', 2000, 'error');
            } else {
              this.toastService.add('An unexpected error occurred. Please try again later.', 2000, 'error');
            }
          }
        })
      }
      else {
        const payload: User = { 'name': nameElement.value, 'surname': surnameElement.value, 'email': emailElement.value, 'password': passwordElement.value, 'admin': this.checkboxValue, 'telephone': telephoneElement.value}
        this.appService.updateUser(+this.userId, payload).subscribe({
          next: (response) => {
            this.toastService.add('User updated', 2000, 'success');
          },
            error: (error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.toastService.add('Invalid user credentials. Please try again.', 2000, 'error');
            } else {
              this.toastService.add('An unexpected error occurred. Please try again later.', 2000, 'error');
            }
          }
        })
      }
    } else {
      this.toastService.add('One of credentials not filled', 2000, 'error');
    }
  }

  checkBoxValue(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checkboxValue = target.checked;
  }


  deleteUser() {
    this.appService.deleteUser(+this.userId).subscribe({
      next: (response) => {
        this.toastService.add('User deleted', 2000, 'success');
        this.router.navigate(['/admin']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toastService.add('Invalid user credentials. Please try again.', 2000, 'error');
        } else {
          this.toastService.add('An unexpected error occurred. Please try again later.', 2000, 'error');
        }
      }
    })
  }

}
