import { TestBed, inject, fakeAsync, async, getTestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';

describe('DataService', () => {
  let _data: DataService;
  
  // Setup
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
      ],
      providers: [
        DataService
      ]
    });

    _data = getTestBed().get(DataService);

  }));

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    _data = null;
    httpMock.verify();
  }));

  // Service specs
  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));
  // Data service - filter tests
  it('should return true from filter when searchText is empty', () => {
    expect(_data.filter("")).toBeTruthy();
  });
  it('should return true from filter when searchText can match coinlist dataset', () => {
    expect(_data.filter("bi")).toBeTruthy();
  });
  it('should return false from filter when searchText cannot match anycoinlist dataset', () => {
    expect(_data.filter("fdrqerf")).toBeFalsy();
  });
  // Data service - full price http tests
  it('should return coin full price info or catch error', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    let mockResponse: any = {
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
    _data.getPricesFull().subscribe(
      res => {
        expect(res).toEqual(mockResponse);
      }
    );

  }));
  it('should throw with an error message when full price API returns an error', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    _data.getPricesFull().catch(actualError => {
      expect(Observable.of(actualError)).toBeTruthy();
      expect(actualError).toBeTruthy();
      return Observable.of(actualError);
    }).subscribe();
  }));
  // Data service - single price http tests
  it('should expect a GET for request coin url', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    _data.getPriceSingle("BTC").subscribe();
    httpMock.expectOne({
      url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&extraParams=Cryptocurrency_Market',
      method: 'GET'
    });
  })));
  // Data service - Full coin names tests
  it('should return array of names when getNamesFull() called', () => {
    let mockResult = ['Bitcoin', 'Ethereum', 'Ripple'];

    let coins: any = {
      'Bitcoin': 'BTC',
      'Ethereum': 'ETH',
      'Ripple': 'XRP',
    };
    _data.setCoinData(coins);
    expect(_data.getNamesFull()).toEqual(mockResult);
  });
  // Data service - single coin name tests
  it('should return single name when getNameSingle(symbol) called', () => {
    expect(_data.getNameSingle("BTC")).toEqual("Bitcoin");
  });
  // Data service - images tests
  it('should return array of image urls and single image url', () => {
    let imageurlPrefix = "./assets/crypto-icons/";
    let mockResult = [
      imageurlPrefix + "btc.svg", imageurlPrefix + "eth.svg", imageurlPrefix + "xrp.svg"
    ];

    let coins: any = {
      'Bitcoin': 'BTC',
      'Ethereum': 'ETH',
      'Ripple': 'XRP',
    };
    _data.setCoinData(coins);
    expect(_data.getImagesFull()).toEqual(mockResult);
    expect(_data.getImageSingle("BTC")).toEqual(imageurlPrefix + "btc.svg");
  });
  // Data service - historical data http tests
  it('should expect a GET for request minute historical data', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    let symbol = "BTC";
    let prefix = "histominute";
    let timelimit = 1440;
    let aggregate = 3;

    _data.getHitoricalPrices(symbol, prefix, timelimit, aggregate).subscribe();
    httpMock.expectOne({
      url: "https://min-api.cryptocompare.com/data/" + prefix + "?fsym=" + symbol + "&tsym=USD&limit=" + timelimit + "&aggregate=" + aggregate + "&extraParams=Cryptocurrency_Market",
      method: 'GET'
    });
  })));
  it('should expect a GET for request hourly historical data', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    let symbol = "BTC";
    let prefix = "histohour";
    let timelimit = 168;
    let aggregate = 1;

    _data.getHitoricalPrices(symbol, prefix, timelimit, aggregate).subscribe();
    httpMock.expectOne({
      url: "https://min-api.cryptocompare.com/data/" + prefix + "?fsym=" + symbol + "&tsym=USD&limit=" + timelimit + "&aggregate=" + aggregate + "&extraParams=Cryptocurrency_Market",
      method: 'GET'
    });
  })));
  it('should expect a GET for request daily historical data', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    let symbol = "BTC";
    let prefix = "histoday";
    let timelimit = 365;
    let aggregate = 2;

    _data.getHitoricalPrices(symbol, prefix, timelimit, aggregate).subscribe();
    httpMock.expectOne({
      url: "https://min-api.cryptocompare.com/data/" + prefix + "?fsym=" + symbol + "&tsym=USD&limit=" + timelimit + "&aggregate=" + aggregate + "&extraParams=Cryptocurrency_Market",
      method: 'GET'
    });
  })));

});
