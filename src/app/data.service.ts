import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class DataService {

  private result: any;
  private symbolnameData: any = {
    'Bitcoin': 'BTC',
    'Ethereum': 'ETH',
    'Ripple': 'XRP',
    'Bitcoin Cash': 'BCH',
    'Litecoin': 'LTC',
    'Cardano': 'ADA',
    'NEO': 'NEO',
    'Stellar': 'XLM',
    'EOS': 'EOS',
    'Dash': 'DASH',
    'IOTA': 'IOT',
    'Monero': 'XMR',
    'NEM': 'XEM',
    'Eth Classic': 'ETC',
    'TRON': 'TRX',
    'VeChain': 'VEN',
    'Lisk': 'LSK',
    'Qtum': 'QTUM',
    'Bitcoin Gold': 'BTG',
    'Tether': 'USDT'
  };
  private defaultDataCopy: any = { ...this.symbolnameData };

  private priceMultiurl: string;
  private imageurlPrefix: string = "./assets/crypto-icons/";
  private imageurlSuffix: string[];
  private images1x: any[];
  private images2x: any[];

  private timer = Observable.timer(0, 15000);

  constructor(private _http: HttpClient) { }

  // Fetch price data every 15 seconds
  getPricesFull(): Observable<any> {
    let coinlist: string[] = Object.values(this.symbolnameData);
    //console.log(orderedData);
    this.priceMultiurl = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + coinlist.join() + "&tsyms=USD";

    // interval is set to 15000(15s)
    return this.timer
      .flatMap(result => this.result = this._http.get(this.priceMultiurl))
      .pipe(catchError(this.handleError('getPricesFull', [])));
  }

  // Fetch single price data
  getPriceSingle(symbol: string): Observable<any> {
    return this._http.get("https://min-api.cryptocompare.com/data/price?fsym=" + symbol + "&tsyms=USD")
      .map(result => this.result = result)
      .pipe(catchError(this.handleError('getPriceSingle', [])));
  }

  getNamesFull(): string[] {
    //console.log(Object.keys(this.sortData(this.symbolnameData, sortOrder)));
    return Object.keys(this.symbolnameData);
  }

  getNameSingle(symbol: string): string {
    return Object.keys(this.symbolnameData).find(key => this.symbolnameData[key] === symbol);
  }

  getImages1xFull(): any[] {
    let coinlist: string[] = Object.values(this.symbolnameData);
    this.images1x = [];

    this.imageurlSuffix = coinlist.map(res => res.toLowerCase());
    for (let symbol of this.imageurlSuffix) {
      this.images1x.push(this.imageurlPrefix + symbol + ".png");
    }

    return this.images1x;
  }

  getImage1xSingle(symbol: string): string {
    return this.imageurlPrefix + symbol.toLowerCase() + ".png"
  }

  getImages2xFull(): any[] {
    let coinlist: string[] = Object.values(this.symbolnameData);
    this.images2x = [];

    this.imageurlSuffix = coinlist.map(res => res.toLowerCase());
    for (let symbol of this.imageurlSuffix) {
      this.images2x.push(this.imageurlPrefix + symbol + "@2x.png");
    }

    return this.images2x;
  }

  getImage2xSingle(symbol: string): string {
    return this.imageurlPrefix + symbol.toLowerCase() + "@2x.png"
  }

  // Fetch minute/hourly/daily price of historical data
  getHitoricalPrices(symbol: string, prefix: string, timelimit: number, aggregate: number): Observable<any> {
    //console.log(this._http.get("https://min-api.cryptocompare.com/data/" + prefix + "?fsym=" + `${symbol}` + "&tsym=USD&limit=" + timelimit + "&aggregate=" + aggregate));
    return this._http.get("https://min-api.cryptocompare.com/data/" + prefix + "?fsym=" + `${symbol}` + "&tsym=USD&limit=" + timelimit + "&aggregate=" + aggregate)
      .map(result => this.result = result)
      .pipe(catchError(this.handleError(`getHitoricalPrices symbol=${symbol}`)));
  }

  sortData(sortName: string, sortOrder: string) {
    switch (sortName) {

      case "name": {
        if (sortOrder === "ascend") {
          this.symbolnameData = Object.keys(this.symbolnameData).sort().reduce((r, k) => (r[k] = this.symbolnameData[k], r), {});
        } else if (sortOrder === "descend") {
          this.symbolnameData = Object.keys(this.symbolnameData).sort((a, b) => b.localeCompare(a))
            .reduce((r, k) => (r[k] = this.symbolnameData[k], r), {});
        } else {
          this.symbolnameData = this.defaultDataCopy;
        }
        //console.log(this.symbolnameData);
        break;
      }

      case "symbol": {
        if (sortOrder === "ascend") {
          this.symbolnameData = Object.keys(this.symbolnameData).sort((a, b) => this.symbolnameData[a].localeCompare(this.symbolnameData[b]))
            .reduce((r, k) => (r[k] = this.symbolnameData[k], r), {});
          // console.log(this.symbolnameData);
        } else if (sortOrder === "descend") {
          this.symbolnameData = Object.keys(this.symbolnameData).sort((a, b) => this.symbolnameData[b].localeCompare(this.symbolnameData[a]))
            .reduce((r, k) => (r[k] = this.symbolnameData[k], r), {});
        } else {
          this.symbolnameData = this.defaultDataCopy;
        }
        //console.log(this.symbolnameData);
        break;
      }

    }

    //console.log(this.symbolnameData);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
