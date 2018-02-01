import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {

  result: any;

  constructor(private _http: HttpClient) {}

  getPrices(): Observable<any> {
    return Observable.interval(10000).startWith(0)
      .mergeMapTo(this._http.get("https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,IOT&tsyms=USD"))
      .map(result => this.result = result);
  }

}
