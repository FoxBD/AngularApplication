import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {CarlistComponent} from "./carlist/carlist.component";
import {CareditComponent} from "./caredit/caredit.component";
import {AdminComponent} from "./admin/admin.component";
import {CarviewComponent} from "./carview/carview.component";
import {RegisterComponent} from "./register/register.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  // edit and create User use the same function
  { path: 'register', component: RegisterComponent },
  { path: 'user-edit/:id', component: RegisterComponent },

  { path: 'cars', component: CarlistComponent },

  // edit and create Car use the same function
  { path: 'edit/:id', component: CareditComponent },
  { path: 'add', component: CareditComponent },

  { path: 'car/:id', component: CarviewComponent },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
