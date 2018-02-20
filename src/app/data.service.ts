import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class DataService {

  private result: any;
  private coinlist: string = "BTC,ETH,XRP,BCH,LTC,ADA,NEO,XLM,EOS,DASH,IOT,XMR,XEM,ETC,TRX,VEN,LSK,QTUM,BTG,USDT";
  private priceMultiurl: string = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + this.coinlist + "&tsyms=USD";

  private symbolnameData: any = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'XRP': 'Ripple',
    'BCH': 'Bitcoin Cash',
    'LTC': 'Litecoin',
    'ADA': 'Cardano',
    'NEO': 'NEO',
    'XLM': 'Stellar',
    'EOS': 'EOS',
    'DASH': 'Dash',
    'IOT': 'IOTA',
    'XMR': 'Monero',
    'XEM': 'NEM',
    'ETC': 'Eth Classic',
    'TRX': 'TRON',
    'VEN': 'VeChain',
    'LSK': 'Lisk',
    'QTUM': 'Qtum',
    'BTG': 'Bitcoin Gold',
    'USDT': 'Tether'
  };

  private urlPrefix: string = "http://p3k7sti9o.bkt.clouddn.com/";
  private urlSuffix: string[] = this.coinlist.toLowerCase().split(',');
  private images1x: any[] = [];
  private images2x: any[] = [];

  constructor(private _http: HttpClient) {
    for (let _i = 0; _i < this.urlSuffix.length; _i++) {
      this.images1x.push(this.urlPrefix + this.urlSuffix[_i] + ".png");
      this.images2x.push(this.urlPrefix + this.urlSuffix[_i] + "@2x.png");
      //console.log(this.images2x[_i]);
    }
  }

  // Fetch price data every 10 seconds
  getPricesFull(): Observable<any> {
    // modify back to 10000
    return Observable.interval(10000).startWith(0)
      .mergeMapTo(this._http.get(this.priceMultiurl))
      .map(result => this.result = result)
      .pipe(catchError(this.handleError('getPricesFull', [])));
  }

  // Fetch single price data
  getPriceSingle(symbol: string): Observable<any> {
    return this._http.get("https://min-api.cryptocompare.com/data/price?fsym=" + symbol + "&tsyms=USD")
    .map(result => this.result = result)
    .pipe(catchError(this.handleError('getPriceSingle', [])));
  }

  getNamesFull(): string[] {
    //console.log(Object.values(this.symbolnameData));
    return Object.values(this.symbolnameData);
  }

  getNameSingle(symbol: string): string {
    return this.symbolnameData[symbol];
  }

  getImages1xFull(): any[] {
    return this.images1x;
  }

  getImage1xSingle(symbol: string): string {
    return this.urlPrefix + symbol.toLowerCase() + ".png"
  }

  getImages2xFull(): any[] {
    return this.images2x;
  }

  getImage2xSingle(symbol: string): string {
    return this.urlPrefix + symbol.toLowerCase() + "@2x.png"
  }

  // Fetch minute/hourly/daily price of historical data
  getHitoricalPrices(symbol: string, prefix: string, timelimit: number, aggregate: number): Observable<any> {
    // console.log(this._http.get("https://min-api.cryptocompare.com/data/" + prefix + "?fsym=" + `${symbol}` + "&tsym=USD&limit=" + timelimit + "&aggregate=" + aggregate));
    return this._http.get("https://min-api.cryptocompare.com/data/" + prefix + "?fsym=" + `${symbol}` + "&tsym=USD&limit=" + timelimit + "&aggregate=" + aggregate)
      .map(result => this.result = result)
      .pipe(catchError(this.handleError(`getHitoricalPrices symbol=${symbol}`)));
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
