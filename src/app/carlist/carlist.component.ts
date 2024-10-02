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
  brands: Brand[] = [];
  fuels: Fuel[] = [];
  allCars: Car[] = [];

  filters: any;
  brandState: string[] = ['OFF', 'ASC', 'DESC'];
  indexState: number = 0;
  yearState: string[] = ['OFF', 'ASC', 'DESC'];
  indexYear: number = 0;
  priceState: string[] = ['OFF', 'ASC', 'DESC'];
  indexPrice: number = 0;

  pagination: number = 5;
  pageIndex: number = 1;

  constructor(private appService: AppService, private route: ActivatedRoute, public toastService: ToastService) {
  }

  ngOnInit() {
    this.getBrands();
    this.getFuels();

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

  getCars(filters: any) : void {
    this.appService.getCar(filters).subscribe(car => {
      this.allCars = car;
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

  get currentBrandState(): string {
    return this.brandState[this.indexState];
  }

  sortBrand(): void {
    if (this.indexState < 2)
    this.indexState = (this.indexState + 1);
    else this.indexState = 0;
    this.getFilters();
  }

  get currentYearState(): string {
    return this.yearState[this.indexYear];
  }

  sortYear(): void {
    if (this.indexYear < 2)
      this.indexYear = (this.indexYear + 1);
    else this.indexYear = 0;
    this.getFilters();
  }

  get currentPriceState(): string {
    return this.priceState[this.indexPrice];
  }

  sortPrice(): void {
    if (this.indexPrice < 2)
      this.indexPrice = (this.indexPrice + 1);
    else this.indexPrice = 0;

    this.getFilters();
  }

  get totalPages(): number {
    return Math.ceil(this.allCars.length / this.pagination);
  }

  get paginatedCars(): any[] {
    const startIndex = (this.pageIndex - 1) * this.pagination;
    return this.allCars.slice(startIndex, startIndex + this.pagination);
  }

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
