import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DataService', () => {
  let _data: DataService;
  let _http: HttpClient;

  // Setup
  beforeEach(() => {
    _data = new DataService(_http);

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [ DataService ]
    });
  });

  afterEach(() => {
    _data = null;
  });

  // Service specs
  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));


});
