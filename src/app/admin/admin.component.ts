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
  brands: Brand[] = [];
  fuels: Fuel[] = [];
  users: User[] = [];

  pagination: number = 5;
  pageIndex: number = 1;

  constructor(private appService: AppService, private router: Router) { }

  async ngOnInit() {
    await this.getAllData();
  }

  async getAllData() {
    this.appService.getUser().subscribe(user => {
      this.users = user;
      this.appService.getBrand().subscribe(brand => {
        this.brands = brand;
        this.appService.getFuel().subscribe(fuel => {
          this.fuels = fuel;
        });
      });
    });
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.pagination);
  }

  get paginatedUsers(): any[] {
    const startIndex = (this.pageIndex - 1) * this.pagination;
    return this.users.slice(startIndex, startIndex + this.pagination);
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
}
