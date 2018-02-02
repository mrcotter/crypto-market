import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {

  private result: any;
  private coinlist: string = "BTC,ETH,XRP,BCH,ADA,XLM,NEO,LTC,EOS,XEM";
  private url: string = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + this.coinlist + "&tsyms=USD";

  constructor(private _http: HttpClient) {}

  // Fetch data every 10 seconds
  getPricesFull(): Observable<any> {
    return Observable.interval(10000).startWith(0)
      .mergeMapTo(this._http.get(this.url))
      .map(result => this.result = result);
  }

}
