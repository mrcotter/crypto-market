import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CryptoPriceComponent } from './crypto-price/crypto-price.component';
import { CryptoDetailComponent } from './crypto-detail/crypto-detail.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { DataService } from './data.service';
import { routes } from './app-routing.module';
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG } from 'ng-zorro-antd';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  //setup
  beforeEach(async(() => {

    (<any>window).ga = jasmine.createSpy('ga');

    TestBed.configureTestingModule({
      imports: [
        NgZorroAntdModule.forRoot(),
        RouterTestingModule.withRoutes(routes),
        HttpClientModule
      ],
      declarations: [
        AppComponent,
        CryptoPriceComponent,
        CryptoDetailComponent,
        NotfoundComponent
      ],
      providers: [
        DataService,
        { provide: NZ_MESSAGE_CONFIG }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  afterEach(() => {
    (<any>window).ga = undefined;
  });

  //specs
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'Cryptocurrency Market'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Cryptocurrency Market');
  }));

  it('can navigate to home (async)', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    TestBed.get(Router)
      .navigate([''])
      .then(() => {
        expect(location.pathname.endsWith('')).toBe(true);
      }).catch(e => console.log(e));
  }));
  it('can navigate to home (fakeAsync/tick)', fakeAsync(() => {
    let fixture = TestBed.createComponent(AppComponent);
    TestBed.get(Router).navigate(['']);
    fixture.detectChanges();
    //execute all pending asynchronous calls
    tick();
    expect(location.pathname.endsWith('')).toBe(true);
  }));
  it('can navigate to home (done)', done => {
    let fixture = TestBed.createComponent(AppComponent);
    TestBed.get(Router)
      .navigate([''])
      .then(() => {
        expect(location.pathname.endsWith('')).toBe(true);
        done();
      }).catch(e => console.log(e));
  });

});
