import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { catchError, Observable, tap } from "rxjs";
import { Injectable } from "@angular/core";
import { Fuel } from "../models/fuel";
import { Brand } from "../models/brand";
import { User } from "../models/user";
import { Car } from "../models/car";

@Injectable({ providedIn: 'root' })

export class AppService {

  private baseUrl = "http://127.0.0.1:5000/"

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // --------------------------------------------------------------------------------

  // GET FUEL
  getFuel(): Observable<Fuel[]> {
    return this.http.get<Fuel[]>(this.baseUrl + "fuels")
  }

  // GET FUEL by ID
  getOneFuel(id: number): Observable<Fuel[]> {
    return this.http.get<Fuel[]>(this.baseUrl + "fuels/" + id)
  }

  // POST
  addFuel(fuel: Fuel): Observable<Fuel> {
    return this.http.post<Fuel>(this.baseUrl + "fuels", fuel);
  }

  // PUT / PATCH
  updateFuel(id: number, fuel: Fuel): Observable<Fuel> {
    //console.log(id,item)
    return this.http.patch<Fuel>(this.baseUrl + "fuels/" + id, fuel)
  }

  // DELETE
  deleteFuel(id: number): Observable<Fuel> {
    return this.http.delete<Fuel>(this.baseUrl + "fuels/" + id);
  }

  // --------------------------------------------------------------------------------

  // GET BRAND
  getBrand(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.baseUrl + 'brands');
  }

  // GET BRAND by ID
  getOneBrand(id: number): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.baseUrl + "brands/" + id)
  }

  // POST
  addBrand(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(this.baseUrl + "brands", brand);
  }

  // PUT / PATCH
  updateBrand(id: number, brand: Brand): Observable<Brand> {
    return this.http.patch<Brand>(this.baseUrl + "brands/" + id, brand)
  }

  // DELETE
  deleteBrand(id: number): Observable<Brand> {
    return this.http.delete<Brand>(this.baseUrl + "brands/" + id);
  }

  // --------------------------------------------------------------------------------

  // GET USER
  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'users');
  }

  // GET USER by ID
  getOneUser(id: any): Observable<User> {
    return this.http.get<User>(this.baseUrl + "users/" + id)
  }

  // PUT / PATCH
  updateUser(id: number, user: User): Observable<User> {
    return this.http.patch<User>(this.baseUrl + "users/" + id, user)
  }

  // DELETE
  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(this.baseUrl + "users/" + id);
  }

  // --------------------------------------------------------------------------------

  // GET CAR
  getCar(filters: any): Observable<Car[]> {
    let params = new HttpParams();
    if (filters) {
      // filters
      if (filters.brand) {
        if (filters.brand !== 1) params = params.append('brand', filters.brand.toString());
      }
      if (filters.lowPrice) { params = params.append('lowPrice', filters.lowPrice.toString()); }
      if (filters.highPrice) { params = params.append('highPrice', filters.highPrice.toString()); }
      if (filters.mileage) { params = params.append('mileage', filters.mileage.toString()); }
      if (filters.model) { params = params.append('model', filters.model.toString()); }
      if (filters.lowYear) { params = params.append('lowYear', filters.lowYear.toString()); }
      if (filters.highYear) { params = params.append('highYear', filters.highYear.toString()); }
      if (filters.fuel) {
        if (filters.fuel !== 12) params = params.append('fuel', filters.fuel.toString());
      }

      // sorting
      if (filters.sortingBrand > 0) {
        if (filters.sortingBrand === 1) params = params.append('sortingBrand', 1);
        else if (filters.sortingBrand === 2) params = params.append('sortingBrand', 2);
      }
      if (filters.sortingYear > 0) {
        if (filters.sortingYear === 1) params = params.append('sortingYear', 1);
        else if (filters.sortingYear === 2) params = params.append('sortingYear', 2);
      }
      if (filters.sortingPrice > 0) {
        if (filters.sortingPrice === 1) params = params.append('sortingPrice', 1);
        else if (filters.sortingPrice === 2) params = params.append('sortingPrice', 2);
      }
    }
    return this.http.get<Car[]>(this.baseUrl + 'cars', {params});
  }

  // GET CAR by ID
  getOneCar(id: number): Observable<Car> {
    return this.http.get<Car>(this.baseUrl + "cars/" + id)
  }

  // POST
  addCar(car: Car): Observable<Car> {
    return this.http.post<Car>(this.baseUrl + "cars", car);
  }

  // PUT / PATCH
  updateCar(id: string, car: Car): Observable<Car> {
    return this.http.patch<Car>(this.baseUrl + "cars/" + id, car)
  }

  // DELETE
  deleteCar(id: number): Observable<Car> {
    return this.http.delete<Car>(this.baseUrl + "cars/" + id);
  }
}
