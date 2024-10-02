import {Component, OnInit} from '@angular/core';
import {AppService} from "../service/app.service";
import {Car} from "../models/car";
import {Brand} from "../models/brand";
import {Router} from "@angular/router";
import {Mileage} from "../models/mileage";
import {Fuel} from "../models/fuel";
import {AuthService} from "../service/auth.service";
import {User} from "../models/user";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  // init of arrays
  brands: Brand[] = [];
  fuels: Fuel[] = [];
  allCars: Car[] = [];
  mileage = Mileage;

  // when user is logged in this is where it'll be saved
  loggedUser: any | null = null;

  // 2d array for last 10 ad added displayed at the bottom of the page
  featuredCars: Car[][] = [];
  columns = 5;

  // appService has routes for every get, post or edit function
  // authService handles User log in, register and saving data to localstorage, also retrieving stuff from there
  // router enables us to move around the application by calling desired url, I use it here to get to AD list
  constructor(private appService: AppService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loggedUser = this.authService.getUser();
    this.getCars();
    this.getBrands();
    this.getFuels();
  }

  // function called at the beginning of page life cycle, I use it to hide or show some elements (Buttons) and
  // also choose, between log in or log out button
  isLoggedIn(): boolean {
    return this.loggedUser !== null;
  }

  // simple function that goes to authService when pressed
  logout(): void {
    this.authService.logout();
    window.location.reload();
  }

  // First of three get requests to BE, it first gets all cars from BE and then calls additional function featuredArray
  getCars(): void {
    this.appService.getCar(null).subscribe(car => {
      this.allCars = car;
      this.featuredCars = this.featuredArray(this.allCars, this.columns);
    });
  }

  // Second of three get requests to BE, as simple as you can get: retrieve items and set them to initialized array
  getBrands(): void {
    this.appService.getBrand().subscribe(brand => {
      this.brands = brand;
    });
  }

// Last init get request to BE, same as before: retrieve items and set them to initialized array
  getFuels(): void {
    this.appService.getFuel().subscribe(fuel => {
      this.fuels = fuel;
    });
  }

  // additional function called by getCars(), input vars are car array and number of rows (set at the beginning as public var to 5)
  // it goes through for loop (car array) and splits it into columns,
  // (number of items in this column is determined by number of rows), this is done twice so we get 2 columns
  featuredArray(array: Car[], size: number): Car[][] {
    const result: Car[][] = [];
    for (let i = 0; i < (size*2); i += size) { // this loop is repeated once
      result.push(array.slice(i, i + size));  // first loop: slice array from item index 0 to index 4
                                              // second loop: slice array from item index 5 to index 9
    }
    return result;
  }

  // initSearch called whenever search is initiated, first it collects all the data from all the input elements even those
  // that are empty, and sets them up as parameters in URL redirect
  initSearch(): void {
    const brand = (document.getElementById('brand') as HTMLSelectElement).value;
    const lowPrice = (document.getElementById('lowPrice') as HTMLInputElement).value;
    const highPrice = (document.getElementById('highPrice') as HTMLInputElement).value;
    const mileage = (document.getElementById('mileage') as HTMLSelectElement).value;
    const model = (document.getElementById('model') as HTMLInputElement).value;
    const lowYear = (document.getElementById('lowYear') as HTMLInputElement).value;
    const highYear = (document.getElementById('highYear') as HTMLInputElement).value;
    const fuel = (document.getElementById('fuel') as HTMLSelectElement).value;
    console.log(brand, lowPrice, highPrice, mileage, model, lowYear, highYear, fuel);

    this.router.navigate(['/cars'], { queryParams: { brand, lowPrice, highPrice, mileage, model, lowYear, highYear, fuel }});
  }

}
