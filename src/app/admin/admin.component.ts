import {Component, OnInit} from '@angular/core';
import {AppService} from "../service/app.service";
import {Router} from "@angular/router";
import {Brand} from "../models/brand";
import {Fuel} from "../models/fuel";
import {User} from "../models/user";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  // init of arrays
  brands: Brand[] = [];
  fuels: Fuel[] = [];
  users: User[] = [];

  // init of values for pagination of the user table
  pagination: number = 5;
  pageIndex: number = 1;

  // authService handles User log in, register and saving data to localstorage, also retrieving stuff from there
  // router enables us to move around the application by calling desired url, I use it here to get to AD list
  constructor(private appService: AppService, private router: Router) { }

  ngOnInit() {
    this.getAUsers();
    this.getBrands();
    this.getFuels();
  }

  // First of three get requests to BE, as simple as you can get: retrieve items and set them to initialized array
  getAUsers() {
    this.appService.getUser().subscribe(user => {
      this.users = user;
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

  // Function for setting up total number of pages for User table
  get totalPages(): number {
    return Math.ceil(this.users.length / this.pagination);
  }

  // Real time function that gets called each time new page inside of element table is selected, it just splits the original
  // array into specified size and returns it
  get paginatedUsers(): any[] {
    const startIndex = (this.pageIndex - 1) * this.pagination;
    return this.users.slice(startIndex, startIndex + this.pagination);
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
}
