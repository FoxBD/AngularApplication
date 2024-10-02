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
  // init of array
  user: User = {}

  userId: string = "";

  checkboxValue?: boolean = false;

  // authService handles User log in, register and saving data to localstorage, also retrieving stuff from there
  // appService has routes for every get, post or edit function
  // router enables us to move around the application by calling desired url, I use it here to get to AD list
  // toastService shows informative popups to user, I use them to indicate error when filling forms or show success on successful login or create
  constructor(private authService: AuthService, private appService: AppService, private router: Router, public toastService: ToastService) {}

  ngOnInit() {
    const fullPath = this.router.url.split('/') // from URL get data
    if (fullPath[1] === 'user-edit') { // if true, page used for editing existing user
      this.userId = fullPath[2]
      this.adminEditing()
    }
  }

  // function retrieves user and set them to form on page, for bool control it also sets state of Is admin checkbox
  adminEditing(): void {
    this.appService.getOneUser(this.userId).subscribe((response)=> {
      this.user = response;
      this.checkboxValue = response.admin;
      console.log(this.user);
    })
  }

  register() {
    // form is first checked if all elements are filled if so, edit or create request is being sent
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
      if (!this.userId) { // if there is no userId present in URL, that means that the page is in creating form and will create new user with specified data
        this.authService.register(nameElement.value, surnameElement.value,emailElement.value, passwordElement.value, telephoneElement.value).subscribe({
          next: (response) => {
            this.toastService.add('User created, welcome ' + nameElement.value, 2000, 'success');
            this.router.navigate(['/login']); // user redirected back to login page
          },
          error: (error: HttpErrorResponse) => { // if there is error in time of creating user or if values are incorrect, user is shown a popup with an error message
            if (error.status === 401) {
              this.toastService.add('Invalid register credentials. Please try again.', 2000, 'error');
            } else {
              this.toastService.add('An unexpected error occurred. Please try again later.', 2000, 'error');
            }
          }
        })
      }
      else { // this is initialized when userId is present in URL, that means that the page is in editing form
        // User instance filled with data written in form
        const payload: User = { 'name': nameElement.value, 'surname': surnameElement.value, 'email': emailElement.value, 'password': passwordElement.value, 'admin': this.checkboxValue, 'telephone': telephoneElement.value}
        this.appService.updateUser(+this.userId, payload).subscribe({
          next: (response) => {
            this.toastService.add('User updated', 2000, 'success');
          },
            error: (error: HttpErrorResponse) => { // if there is error in time of creating user or if values are incorrect, user is shown a popup with an error message
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

  // function just sets value that is represented by checkbox, tick 1, empty 0
  checkBoxValue(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checkboxValue = target.checked;
  }


  // function deletes user and redirects user back to admin control panel for further work, if it fails to find selected user it throws and
  // error and shows a popup
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
