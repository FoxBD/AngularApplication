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
  brands: Brand[] = [];
  fuels: Fuel[] = [];
  loggedUser: any | null = null;

  allCars: Car[] = [];
  featuredCars: Car[][] = [];
  columns = 5;

  mileage = Mileage;

  constructor(private appService: AppService, private authService: AuthService, private router: Router) {

  }


  ngOnInit(): void {
    this.loggedUser = this.authService.getUser();
    this.getCars();
    this.getBrands();
    this.getFuels();
  }

  isLoggedIn(): boolean {
    return this.loggedUser !== null;
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }

  getCars(): void {
    this.appService.getCar(null).subscribe(car => {
      this.allCars = car;
      this.featuredCars = this.featuredArray(this.allCars, this.columns);
    });
  }

  getBrands(): void {
    this.appService.getBrand().subscribe(brand => {
      this.brands = brand;
    });
  }

  getFuels(): void {
    this.appService.getFuel().subscribe(fuel => {
      this.fuels = fuel;
    });
  }

  featuredArray(array: Car[], size: number): Car[][] {
    const result: Car[][] = [];
    for (let i = 0; i < 10; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

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
