import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class DataService {

  private result: any;
  private coinlist: string = "BTC,ETH,XRP,BCH,ADA,XLM,NEO,LTC,EOS,XEM";
  private priceMultiurl: string = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + this.coinlist + "&tsyms=USD";

  private symbolnameData: any = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'XRP': 'Ripple',
    'BCH': 'Bitcoin Cash',
    'ADA': 'Cardano',
    'XLM': 'Stellar',
    'NEO': 'NEO',
    'LTC': 'Litecoin',
    'EOS': 'EOS',
    'XEM': 'NEM'
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
    return Observable.interval(100000).startWith(0)
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

  // Fetch hourly price historical data
  getMinutePrices(symbol: string, limit: number): Observable<any> {
    return this._http.get("https://min-api.cryptocompare.com/data/histominute?fsym=" + `${symbol}` + "&tsym=USD&limit=" + limit + "&aggregate=15")
      .map(result => this.result = result)
      .pipe(catchError(this.handleError(`getMinutePrices symbol=${symbol}`)));
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
