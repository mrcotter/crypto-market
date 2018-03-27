import { TestBed, inject, fakeAsync, async } from '@angular/core/testing';

import { DataService } from './data.service';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DataService', () => {
  let _data: DataService;
  let _httpClientSpy: { get: jasmine.Spy };

  // Setup
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        DataService
      ]
    });

    _httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    _data = new DataService(<any> _httpClientSpy);

  });

  afterEach(() => {
    _data = null;
  });

  // Service specs
  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));
  // Data service function - filter tests
  it('should return true from filter when searchText is empty', () => {
    expect(_data.filter("")).toBeTruthy();
  });
  it('should return true from filter when searchText can match coinlist dataset', () => {
    expect(_data.filter("bi")).toBeTruthy();
  });
  it('should return false from filter when searchText cannot match anycoinlist dataset', () => {
    expect(_data.filter("fdrqerf")).toBeFalsy();
  });
  // Data service http tests
  it('search should return coin full price info', fakeAsync(() => {
    const response = {
      "RAW": {
        "BTC": {
          "USD": {
            "TYPE": "5",
            "MARKET": "CCCAGG",
            "FROMSYMBOL": "BTC",
            "TOSYMBOL": "USD",
            "FLAGS": "1",
            "PRICE": 8054.75,
            "LASTUPDATE": 1522115995,
            "LASTVOLUME": 0.07,
            "LASTVOLUMETO": 562.667,
            "LASTTRADEID": "1522115995.8158",
            "VOLUMEDAY": 7637.26637883005,
            "VOLUMEDAYTO": 62468747.565034196,
            "VOLUME24HOUR": 131184.75116431882,
            "VOLUME24HOURTO": 1071501059.9652482,
            "OPENDAY": 8152.2,
            "HIGHDAY": 8226.24,
            "LOWDAY": 8054.71,
            "OPEN24HOUR": 8427.71,
            "HIGH24HOUR": 8495.26,
            "LOW24HOUR": 7855.38,
            "LASTMARKET": "Kraken",
            "CHANGE24HOUR": -372.9599999999991,
            "CHANGEPCT24HOUR": -4.425401443571256,
            "CHANGEDAY": -97.44999999999982,
            "CHANGEPCTDAY": -1.195382841441572,
            "SUPPLY": 16941412,
            "MKTCAP": 136458838307,
            "TOTALVOLUME24H": 487363.2212056788,
            "TOTALVOLUME24HTO": 3940429591.530893
          }
        }
      },
      "DISPLAY": {
        "BTC": {
          "USD": {
            "FROMSYMBOL": "Ƀ",
            "TOSYMBOL": "$",
            "MARKET": "CryptoCompare Index",
            "PRICE": "$ 8,054.75",
            "LASTUPDATE": "Just now",
            "LASTVOLUME": "Ƀ 0.07000",
            "LASTVOLUMETO": "$ 562.67",
            "LASTTRADEID": "1522115995.8158",
            "VOLUMEDAY": "Ƀ 7,637.27",
            "VOLUMEDAYTO": "$ 62,468,747.6",
            "VOLUME24HOUR": "Ƀ 131,184.8",
            "VOLUME24HOURTO": "$ 1,071,501,060.0",
            "OPENDAY": "$ 8,152.20",
            "HIGHDAY": "$ 8,226.24",
            "LOWDAY": "$ 8,054.71",
            "OPEN24HOUR": "$ 8,427.71",
            "HIGH24HOUR": "$ 8,495.26",
            "LOW24HOUR": "$ 7,855.38",
            "LASTMARKET": "Kraken",
            "CHANGE24HOUR": "$ -372.96",
            "CHANGEPCT24HOUR": "-4.43",
            "CHANGEDAY": "$ -97.45",
            "CHANGEPCTDAY": "-1.20",
            "SUPPLY": "Ƀ 16,941,412.0",
            "MKTCAP": "$ 136.46 B",
            "TOTALVOLUME24H": "Ƀ 487.36 K",
            "TOTALVOLUME24HTO": "$ 3,940.43 M"
          }
        }
      }
    };

    let coins: any = { 'Bitcoin': 'BTC' };
    _data.setCoinData(coins);


  }));


});
