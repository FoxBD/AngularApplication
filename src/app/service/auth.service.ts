import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:5000';
  public loggedUser: User = {};

  constructor(private http: HttpClient) {}

  register(name: string, surname: string, email: string, password: string, telephone: string): Observable<any> {
    const payload = { name, surname, email, password, telephone };
    return this.http.post(`${this.baseUrl}/users/register`, payload);
  }

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post(`${this.baseUrl}/users/login`, payload);
  }

  saveToken(response: any) {
    this.loggedUser = {
      id: response.id,
      name: response.name,
      surname: response.surname,
      admin: response.admin
    }
    localStorage.setItem('bearer_user', JSON.stringify(this.loggedUser));
    localStorage.setItem('bearer_token', response.token);
  }

  getToken(): string | null {
    return localStorage.getItem('bearer_token');
  }

  getUser(): string | null {
    const userString = localStorage.getItem('bearer_user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  }

  logout() {
    localStorage.removeItem('bearer_token');
    localStorage.removeItem('bearer_user');
  }
}
