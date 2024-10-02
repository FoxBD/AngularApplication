import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './login/login.component';
import { CarlistComponent } from './carlist/carlist.component';
import { CarviewComponent } from './carview/carview.component';
import { CareditComponent } from './caredit/caredit.component';
import { AdminComponent } from './admin/admin.component';
import { DatalistComponent } from './datalist/datalist.component';
import { RegisterComponent } from './register/register.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { TranslationsComponent } from './translations/translations.component';

// function added for localization - english and slovenian
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CarlistComponent,
    CarviewComponent,
    CareditComponent,
    AdminComponent,
    DatalistComponent,
    RegisterComponent,
    TranslationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule, // For all requests to BE
    TranslateModule.forRoot({ // Localization
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
