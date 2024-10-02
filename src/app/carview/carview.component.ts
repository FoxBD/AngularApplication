import {Component, OnInit} from '@angular/core';
import {AppService} from "../service/app.service";
import {Car} from "../models/car";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-carview',
  templateUrl: './carview.component.html',
  styleUrl: './carview.component.scss'
})
export class CarviewComponent implements OnInit {
  // init of array
  car: Car | null = null;

  // when user is logged in this is where it'll be saved
  loggedUser: any | null = null;

  // appService has routes for every get, post or edit function
  // router enables us to move around the application by calling desired url, I use it here to get to AD list
  constructor(private appService: AppService, private route: ActivatedRoute) {}

  ngOnInit() {
    // From localstorage get logged user and save it to loggedUser
    const bearerUserString = localStorage.getItem("bearer_user");
    if (bearerUserString) {
      this.loggedUser = JSON.parse(bearerUserString);
      console.log(this.loggedUser)
    }

    // From URL get id, this represents car id in the database
    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) { // if there is an id, call GET request to BE, if not, show nothing and there is a possible error
      this.getCar(+carId) // string -> number
    }
  }

  // Get request to BE, as simple as you can get: retrieve items and set them to initialized array
  getCar(id: number) {
    this.appService.getOneCar(id).subscribe((response) => {
        console.log(response);
        this.car = response;
      }
    )
  }

  // Function made to check if user can edit the AD, that is possible to owner of the AD and admin users
  isAuthor() {
    if (this.loggedUser) {
      if (this.loggedUser.admin) {
        return true;
      }
      return this.loggedUser.id === this.car?.seller
    }
    else {
      return false
    }
  }
}
