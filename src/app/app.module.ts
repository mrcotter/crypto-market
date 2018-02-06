import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NZ_LOCALE, enUS } from 'ng-zorro-antd';

import { DataService } from './data.service'; 

import { AppComponent } from './app.component';
import { CryptoPriceComponent } from './crypto-price/crypto-price.component';
import { CryptoDetailComponent } from './crypto-detail/crypto-detail.component';
import { AppRoutingModule } from './/app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    CryptoPriceComponent,
    CryptoDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot({ extraFontName: 'anticon', extraFontUrl: './assets/fonts/iconfont' }),
    AppRoutingModule
  ],
  providers: [DataService, { provide: NZ_LOCALE, useValue: enUS } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
