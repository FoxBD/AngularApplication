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
  // init of array
  user: User[] = []

  // authService handles User log in, register and saving data to localstorage, also retrieving stuff from there
  // router enables us to move around the application by calling desired url, I use it here to get to AD list
  // toastService shows informative popups to user, I use them to indicate error when filling forms or show success on successful login or create
  constructor(private authService: AuthService, private router: Router, public toastService: ToastService) {}

  ngOnInit() {
    //this.testLogin();
  }

  // Method to test login at the init of page
  testLogin() {
    this.authService.login("admin@admin.com", "admin").subscribe(response => {
      this.toastService.add(response.token, 2000, 'success');
    })
  }

  login() {
    // first stage of this function is to check both elements if they were actually filled with data
    let bothFilled = true;
    const emailElement = document.getElementById('email') as HTMLInputElement;
    if (!emailElement.value) { bothFilled = false; }
    const passwordElement = document.getElementById('password') as HTMLInputElement;
    if (!passwordElement.value) { bothFilled = false; }

    if (bothFilled) {
      // call authService when both elements are filled
      this.authService.login(emailElement.value, passwordElement.value).subscribe({
        next: (response) => {
          this.authService.saveToken(response); // save retrieved token and users data inside of localstorage
          this.router.navigate(['']); // upon successful login, return to main page
        },
        error: (error: HttpErrorResponse) => { // if entered credentials are wrong, throw an error popup
          if (error.status === 401) {
            this.toastService.add('Invalid login credentials. Please try again.', 2000, 'error');
          } else {
            this.toastService.add('An unexpected error occurred. Please try again later.', 2000, 'error');
          }
        }
      })
    } else { // When one of / both elements is / are empty throw an error popup to warn the user
      this.toastService.add('One of credentials not filled', 2000, 'error');
    }
  }
}
