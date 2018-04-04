import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NgZorroAntdModule, NZ_MESSAGE_CONFIG, NzMessageService } from 'ng-zorro-antd';
import { CryptoPriceComponent } from './crypto-price.component';
import { DataService } from '../data.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CryptoPriceComponent', () => {
  let component: CryptoPriceComponent;
  let fixture: ComponentFixture<CryptoPriceComponent>;
  let _data: DataService;
  let _message: NzMessageService;
  let spy: any; 
  // Setup
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        NgZorroAntdModule.forRoot(),
        FormsModule
      ],
      declarations: [CryptoPriceComponent],
      providers: [
        DataService,
        { provide: NZ_MESSAGE_CONFIG }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    _data = TestBed.get(DataService);
    _message = TestBed.get(NzMessageService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    _data = null;
    _message = null;
    component = null;
  });

  // Component specs
  it('should create',
    inject([DataService], (_dataService: DataService) => {
      expect(component).toBeTruthy();
    })
  );
  // Initial Refresh Data tests
  it('refreshData() should be called when component initialised', () => {
    spy = spyOn(component, 'refreshData');
    component.ngOnInit();
    expect(component.refreshData).toHaveBeenCalled();
  });
  // Sort function tests
  it('should call reseverState and refreshData funtions when sort() is called', () => {
    spy = spyOn(_data, 'reseverState');
    let spyComponent = spyOn(component, 'refreshData');
    component.sort('name', 'ascend');
    expect(_data.reseverState).toHaveBeenCalled(); 
    expect(component.refreshData).toHaveBeenCalled();
  });
  // OnSearch function tests
  it('should call reseverState and refreshData funtions when onSearch() is called', () => {
    spy = spyOn(_data, 'reseverState');
    let spyComponent = spyOn(component, 'refreshData');
    let inputValue = 'th';
    component.onSearch(inputValue);
    expect(_data.reseverState).toHaveBeenCalled(); 
    expect(component.refreshData).toHaveBeenCalled();
  });
  it('should call message service if no search result is found', () => {
    spy = spyOn(_message, 'create');
    let inputValue = 'dfsdgtht';
    component.onSearch(inputValue);
    expect(_message.create).toHaveBeenCalled(); 
  });
  // SetTimer funtion tests
  it('should be called after getFullPrice observable value returned', async(() => {
    let coins: any = {
      'Bitcoin': 'BTC',
      'Ethereum': 'ETH',
      'Ripple': 'XRP',
    };
    _data.setCoinData(coins);
    spy = spyOn(component, 'setTimer');

    _data.getPricesFull().subscribe(
      res => {
        expect(component.setTimer).toHaveBeenCalled;
      }
    );
  }));
});
