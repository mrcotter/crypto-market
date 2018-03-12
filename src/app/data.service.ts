import { Injectable, Pipe } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class DataService {

  private result: any;
  // Currently 60 coins in data list
  private symbolnameData: any = {
    'Bitcoin': 'BTC',
    'Ethereum': 'ETH',
    'Ripple': 'XRP',
    'Bitcoin Cash': 'BCH',
    'Litecoin': 'LTC',
    'Cardano': 'ADA',
    'NEO': 'NEO',
    'Stellar': 'XLM',
    'Monero': 'XMR',
    'EOS': 'EOS',
    'IOTA': 'IOT',
    'Dash': 'DASH',
    'NEM': 'XEM',
    'TRON': 'TRX',
    'Eth Classic': 'ETC',
    'Tether': 'USDT',
    'VeChain': 'VEN',
    'Qtum': 'QTUM',
    'Nano': 'XRB',
    'Lisk': 'LSK',
    'Bitcoin Gold': 'BTG',
    'OmiseGo': 'OMG',
    'ICON': 'ICX',
    'Zcash': 'ZEC',
    'Digix DAO': 'DGD',
    'Binance Coin': 'BNB',
    'Steem': 'STEEM',
    'Verge': 'XVG',
    'Stratis': 'STRAT',
    'Populous': 'PPT',
    'ByteCoin': 'BCN',
    'Waves': 'WAVES',
    'Siacoin': 'SC',
    'Status': 'SNT',
    'RChain': 'RHOC',
    'Maker': 'MKR',
    'DogeCoin': 'DOGE',
    'Bitshares': 'BTS',
    'Decred': 'DCR',
    'Aeternity': 'AE',
    'Waltonchain': 'WTC',
    'Augur': 'REP',
    'Electroneum': 'ETN',
    '0x': 'ZRX',
    'Komodo': 'KMD',
    'Bytom': 'BTM',
    'ARK': 'ARK',
    'Veritaseum': 'VERI',
    'Ardor': 'ARDR',
    'Golem': 'GNT',
    'Dragonchain': 'DRGN',
    'Hshare': 'HSR',
    'BAT': 'BAT',
    'Cryptonex': 'CNX',
    'SysCoin': 'SYS',
    'Zilliqa': 'ZIL',
    'KuCoin': 'KCS',
    'DigiByte': 'DGB',
    'Ethos': 'BQX',
    'Gas': 'GAS'
  };
  private defaultDataCopy: any = { ...this.symbolnameData };

  private priceMultiurl: string;
  private imageurlPrefix: string = "./assets/crypto-icons/";
  private imageurlSuffix: string[];
  private images: any[];

  private timer = Observable.timer(0, 15000);

  constructor(private _http: HttpClient) { }

  // Return filtered coin list
  filter(searchText: string): boolean {
    // Recover default data set before filter
    this.symbolnameData = this.defaultDataCopy;

    // If search text is not empty, find fuzzy match and convert to the same object structure
    if (searchText !== "") {

      let data: any[] = (JSON.stringify(this.symbolnameData)).replace(/{|}/g, '').split(',')
        .filter((el) => el.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
      //console.log(data);

      if (data.length === 0) {
        return false;
      }

      let arr: any[] = [];
      data.forEach(function (el) {
        let temp = el.replace(/"/g, '').split(':');
        arr.push(temp);
      });
      //console.log(arr);

      this.symbolnameData = arr.reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {})
      //console.log(this.symbolnameData);
      return true;

    } else {
      // If search text is empty, recover from copy
      this.symbolnameData = this.defaultDataCopy;
      return true;
    }

  }

  // Sort data by coin name or coin symbol
  sortData(sortName: string, sortOrder: string, sortFilter: boolean) {
    //console.log(sortName, sortOrder, sortFilter);
    switch (sortName) {

      case "name": {
        if (sortOrder === "ascend") {
          this.symbolnameData = Object.keys(this.symbolnameData).sort().reduce((r, k) => (r[k] = this.symbolnameData[k], r), {});
        } else if (sortOrder === "descend") {
          this.symbolnameData = Object.keys(this.symbolnameData).sort((a, b) => b.localeCompare(a))
            .reduce((r, k) => (r[k] = this.symbolnameData[k], r), {});
        } else {
          if (!sortFilter) {
            this.symbolnameData = this.defaultDataCopy;
          }
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
          if (!sortFilter) {
            this.symbolnameData = this.defaultDataCopy;
          }
        }
        //console.log(this.symbolnameData);
        break;
      }

      default: {
        if (!sortFilter) {
          this.symbolnameData = this.defaultDataCopy;
        }
        break;
      }

    }
    //console.log(this.symbolnameData);
  }

  // Fetch price data every 15 seconds
  getPricesFull(): Observable<any> {
    let coinlist: string[] = Object.values(this.symbolnameData);
    //console.log(orderedData);
    this.priceMultiurl = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + coinlist.join() + "&tsyms=USD";

    // interval is set to 15000(15s)
    return this.timer
      .flatMap(result => this.result = this._http.get(this.priceMultiurl)
        .pipe(catchError(this.handleError('getPricesFull', []))));
  }

  // Fetch single price data
  getPriceSingle(symbol: string): Observable<any> {
    return this._http.get("https://min-api.cryptocompare.com/data/price?fsym=" + symbol + "&tsyms=USD")
      .map(result => this.result = result)
      .pipe(catchError(this.handleError('getPriceSingle', [])));
  }

  // Return all coin names as arrays
  getNamesFull(): string[] {
    //console.log(Object.keys(this.sortData(this.symbolnameData, sortOrder)));
    return Object.keys(this.symbolnameData);
  }

  // Return coin name by symbol
  getNameSingle(symbol: string): string {
    return Object.keys(this.symbolnameData).find(key => this.symbolnameData[key] === symbol);
  }

  // Get all img path
  getImagesFull(): any[] {
    let coinlist: string[] = Object.values(this.symbolnameData);
    this.images = [];

    this.imageurlSuffix = coinlist.map(res => res.toLowerCase());
    for (let symbol of this.imageurlSuffix) {
      this.images.push(this.imageurlPrefix + symbol + ".svg");
    }

    return this.images;
  }

  // Get single img path
  getImageSingle(symbol: string): string {
    return this.imageurlPrefix + symbol.toLowerCase() + ".svg"
  }

  // Fetch minute/hourly/daily price of historical data
  getHitoricalPrices(symbol: string, prefix: string, timelimit: number, aggregate: number): Observable<any> {
    //console.log(this._http.get("https://min-api.cryptocompare.com/data/" + prefix + "?fsym=" + `${symbol}` + "&tsym=USD&limit=" + timelimit + "&aggregate=" + aggregate));
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

      console.error(error); // log to console instead
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
