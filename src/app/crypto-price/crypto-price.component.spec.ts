import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoPriceComponent } from './crypto-price.component';

describe('CryptoPriceComponent', () => {
  let component: CryptoPriceComponent;
  let fixture: ComponentFixture<CryptoPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptoPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
