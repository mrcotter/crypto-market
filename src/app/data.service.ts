import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {

  private result: any;
  private coinlist: string = "BTC,ETH,XRP,BCH,ADA,XLM,NEO,LTC,EOS,XEM";
  private url: string = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + this.coinlist + "&tsyms=USD";

  private symbolnameData: string[] = [ 'Bitcoin', 'Ethereum', 'Ripple', 'Bitcoin Cash', 'Cardano',
                                      'Stellar', 'NEO', 'Litecoin', 'EOS', 'NEM'];

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
    return Observable.interval(10000).startWith(0)
      .mergeMapTo(this._http.get(this.url))
      .map(result => this.result = result);
  }

  getNamesFull(): string[] {
    return this.symbolnameData;
  }

  getImages1xFull(): any[] {
    return this.images1x;
  }

  getImages2xFull(): any[] {
    return this.images2x;
  }

}
