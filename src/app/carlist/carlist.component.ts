import {Component, OnInit} from '@angular/core';
import {Car} from "../models/car";
import {AppService} from "../service/app.service";
import {AuthService} from "../service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Mileage} from "../models/mileage";
import {Brand} from "../models/brand";
import {Fuel} from "../models/fuel";
import {ToastService} from "../toast/toast.service";

@Component({
  selector: 'app-carlist',
  templateUrl: './carlist.component.html',
  styleUrl: './carlist.component.scss'
})
export class CarlistComponent implements OnInit {
  // init of arrays
  brands: Brand[] = [];
  fuels: Fuel[] = [];
  allCars: Car[] = [];

  // init of filter variable and also sorting items for shown car list
  filters: any;
  brandState: string[] = ['OFF', 'ASC', 'DESC'];
  indexState: number = 0;
  yearState: string[] = ['OFF', 'ASC', 'DESC'];
  indexYear: number = 0;
  priceState: string[] = ['OFF', 'ASC', 'DESC'];
  indexPrice: number = 0;

  // init of values for pagination of the car list table
  pagination: number = 5;
  pageIndex: number = 1;

  // appService has routes for every get, post or edit function
  // router enables us to move around the application by calling desired url, I use it here to get to AD list
  // toastService shows informative popups to user, I use them to indicate error when filling forms or show success on successful login or create
  constructor(private appService: AppService, private route: ActivatedRoute, public toastService: ToastService) {
  }

  ngOnInit() {
    this.getBrands();
    this.getFuels();

    // before calling GET requests for cars, filters and sorting set from previous page (home page), is gathered from URL, if any values were not set they are give undefined value
    this.route.queryParams.subscribe(params => {
      this.filters = {
        brand: params['brand'] ? +params['brand'] : undefined,
        lowPrice: params['lowPrice'] ? +params['lowPrice'] : undefined,
        highPrice: params['highPrice'] ? +params['highPrice'] : undefined,
        mileage: params['mileage'] ? +params['mileage'] : undefined,
        model: params['model'],
        lowYear: params['lowYear'] ? +params['lowYear'] : undefined,
        highYear: params['highYear'] ? +params['highYear'] : undefined,
        fuel: params['fuel'] ? +params['fuel'] : undefined
      };
      this.getCars(this.filters);
    });
  }

  // Last init get request to BE, with all the filters set on home page: retrieve items and set them to initialized array
  getCars(filters: any) : void {
    this.appService.getCar(filters).subscribe(car => {
      this.allCars = car;
    });
  }

  // First of three get requests to BE, it first gets all cars from BE and then calls additional function featuredArray
  getBrands(): void {
    this.appService.getBrand().subscribe(brand => {
      this.brands = brand;
    });
  }

  // Second of three get requests to BE, as simple as you can get: retrieve items and set them to initialized array
  getFuels(): void {
    this.appService.getFuel().subscribe(fuel => {
      this.fuels = fuel;
    });
  }

  getFilters(): void {
    const brand = (document.getElementById('brand') as HTMLSelectElement).value;
    const lowPrice = (document.getElementById('lowPrice') as HTMLInputElement).value;
    const highPrice = (document.getElementById('highPrice') as HTMLInputElement).value;
    const mileage = (document.getElementById('mileage') as HTMLSelectElement).value;
    const model = (document.getElementById('model') as HTMLInputElement).value;
    const lowYear = (document.getElementById('lowYear') as HTMLInputElement).value;
    const highYear = (document.getElementById('highYear') as HTMLInputElement).value;
    const fuel = (document.getElementById('fuel') as HTMLSelectElement).value;
    console.log(brand, lowPrice, highPrice, mileage, model, lowYear, highYear, fuel);
    this.filters = {
      brand: brand ? +brand : undefined,
      lowPrice: lowPrice ? +lowPrice : undefined,
      highPrice: highPrice ? +highPrice : undefined,
      mileage: mileage ? +mileage : undefined,
      model: model,
      lowYear: lowYear ? +lowYear : undefined,
      highYear: highYear ? +highYear : undefined,
      fuel: fuel ? +fuel : undefined,
      sortingBrand: this.indexState,
      sortingYear: this.indexYear,
      sortingPrice: this.indexPrice
    };
    this.toastService.add('Searching...', 2000, 'success');
    this.getCars(this.filters);
  }

  // function that returns the value shown on the button for selecting sorting style, OFF, ASC, DESC, this is retrieved from array initialized above
  get currentBrandState(): string {
    return this.brandState[this.indexState];
  }

  // function cycles between 0, 1 and 2, each call of this function increments index by one and on reaching index 2 it resets back to 0, changes are made visible immediately
  sortBrand(): void {
    if (this.indexState < 2)
    this.indexState = (this.indexState + 1);
    else this.indexState = 0;
    this.getFilters();
  }

  // function that returns the value shown on the button for selecting sorting style, OFF, ASC, DESC, this is retrieved from array initialized above
  get currentYearState(): string {
    return this.yearState[this.indexYear];
  }

  // function cycles between 0, 1 and 2, each call of this function increments index by one and on reaching index 2 it resets back to 0, changes are made visible immediately
  sortYear(): void {
    if (this.indexYear < 2)
      this.indexYear = (this.indexYear + 1);
    else this.indexYear = 0;
    this.getFilters();
  }

  // function that returns the value shown on the button for selecting sorting style, OFF, ASC, DESC, this is retrieved from array initialized above
  get currentPriceState(): string {
    return this.priceState[this.indexPrice];
  }

  // function cycles between 0, 1 and 2, each call of this function increments index by one and on reaching index 2 it resets back to 0, changes are made visible immediately
  sortPrice(): void {
    if (this.indexPrice < 2)
      this.indexPrice = (this.indexPrice + 1);
    else this.indexPrice = 0;

    this.getFilters();
  }

  // Function for setting up total number of pages for car list table
  get totalPages(): number {
    return Math.ceil(this.allCars.length / this.pagination);
  }

  // Real time function that gets called each time new page inside of element table is selected, it just splits the original
  // array into specified size and returns it
  get paginatedCars(): any[] {
    const startIndex = (this.pageIndex - 1) * this.pagination;
    return this.allCars.slice(startIndex, startIndex + this.pagination);
  }

  // controls for buttons to move in pagination. It also protects program from possible page overflow (e.g. max page 4, page 5 can't be reached)
  nextPage() {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;
    }
  }

  previousPage() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
    }
  }

  protected readonly mileage = Mileage;
}
