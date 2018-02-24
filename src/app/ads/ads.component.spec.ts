import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsComponent } from './ads.component';

describe('AdsComponent', () => {
  let component: AdsComponent;
  let fixture: ComponentFixture<AdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
