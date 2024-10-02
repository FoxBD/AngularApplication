import {Component, OnInit} from '@angular/core';
import {AppService} from "../service/app.service";
import {Car} from "../models/car";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'app-carview',
  templateUrl: './carview.component.html',
  styleUrl: './carview.component.scss'
})
export class CarviewComponent implements OnInit {
  car: Car | null = null;
  loggedUser: any | null = null;
  constructor(private appService: AppService, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    const bearerUserString = localStorage.getItem("bearer_user");
    if (bearerUserString) {
      this.loggedUser = JSON.parse(bearerUserString);
      console.log(this.loggedUser)
    }

    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.getCar(+carId)
    }
  }

  getCar(id: number) {
    this.appService.getOneCar(id).subscribe((response) => {
        console.log(response);
        this.car = response;

      }
    )
  }

  isAuthor() {

    if (this.loggedUser) {

      if (this.loggedUser.admin) {
        return true;
      }

      return this.loggedUser.id === this.car?.seller
    } else
      return false
  }
}
