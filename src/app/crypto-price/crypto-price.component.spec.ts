import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgZorroAntdModule, NZ_MESSAGE_CONFIG } from 'ng-zorro-antd';
import { CryptoPriceComponent } from './crypto-price.component';
import { DataService } from '../data.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CryptoPriceComponent', () => {
  let component: CryptoPriceComponent;
  let fixture: ComponentFixture<CryptoPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        NgZorroAntdModule.forRoot(),
        FormsModule
      ],
      declarations: [ CryptoPriceComponent ],
      providers: [
        DataService,
        { provide: NZ_MESSAGE_CONFIG }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create',
  inject([DataService], (_dataService: DataService) => {
    expect(component).toBeTruthy();
  })
);
});
