import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { DataService } from './data.service'; 

import { AppComponent } from './app.component';
import { CryptoPriceComponent } from './crypto-price/crypto-price.component';


@NgModule({
  declarations: [
    AppComponent,
    CryptoPriceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
