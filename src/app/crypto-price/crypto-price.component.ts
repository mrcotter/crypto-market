import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';
import { Crypto } from '../crypto';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-crypto-price',
  templateUrl: './crypto-price.component.html',
  styleUrls: ['./crypto-price.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 1, visibility: 'visible'})),
      state('out', style({opacity: 0, visibility: 'hidden'})),
      transition('in <=> out', [
        animate('1s ease-out')
      ])
    ])
  ]
})
export class CryptoPriceComponent implements OnInit {

  public loaded = false;
  public fadeInState = 'in';
  public fadeOutState = 'out';
  // State change after image is fully loaded
  public isLoaded(event: Event) {
    this.loaded = true;
    this.fadeInState = 'out';
    this.fadeOutState = 'in';
  }

  cryptos: Crypto[];
  public cryData: any[];

  private receiveData: any;
  private cryptoNames: string[];
  private cryptoImages1x: string[];
  private cryptoImages2x: string[];
  private cryptoLastPrices: number[];
  private cryptoPriceCompare: number[];

  private _placeholderBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAClJREFUSIntzTEBAAAIwzDAv+dhAr5UQNNJ6rN5vQMAAAAAAAAAAIDDFsfxAz1KKZktAAAAAElFTkSuQmCC';
  private _placeHolderSafe: SafeUrl;

  private showloader: boolean = false;
  private subscription: Subscription;
  private timer: Observable<any>;

  private _sortValue = null;
  private _sortName = null;
  private _loading = true;
  private _current = 1;
  private _index = 1;
  private _changeIndex = false;
  private _pageSize = 20;
  private _sortMap = {
    name   : null,
    symbol : null
  };

  _searchText: string = "";
  input_id: string = "";

  constructor(
    private _data: DataService,
    private _message: NzMessageService,
    private _sanitizer: DomSanitizer
  ) { }

  // Callback when sort is triggered
  sort(sortName: string, sortEvent: string) {
    this._sortValue = sortEvent;
    this._sortName = sortName;
    //console.log(this._sortValue);
    Object.keys(this._sortMap).forEach(key => {
      if ( key !== sortName ) {
        this._sortMap[key] = null;
      } else {
        this._sortMap[key] = sortEvent;
      }
    });
    this.refreshData();
  }

  // Callback when search is triggered
  onSearch(text: string): void {
    let result:boolean = this._data.filter(text);
    if (!result) {
        // Display message when no coins are found and reset search input
        this._message.create('warning','We couldn’t find any coins for ' + text);
        this._searchText = "";
    }
    this.refreshData(true);
  }

  ngOnInit() {
    this.refreshData();
  }

  refreshData(reset:boolean = false) {
    // When page size changed, reset pagination index to 1 and others to default values
    if (reset) {
      this._current = 1;
      this._sortName = null;
      this._sortValue = null;
      this._searchText = "";
    }

    this._loading = true;
    // Sort dataset before get
    this._data.sortData(this._sortName, this._sortValue);

    this.cryData = [];
    this.cryptoLastPrices = [];
    this.cryptoPriceCompare = [];
    this.cryptoNames = this._data.getNamesFull();
    this.cryptoImages1x = this._data.getImages1xFull();
    this.cryptoImages2x = this._data.getImages2xFull();
    this._placeHolderSafe = this._sanitizer.bypassSecurityTrustUrl(this._placeholderBase64);

    this._data.getPricesFull()
      .subscribe(res => {
        this.receiveData = res.DISPLAY;
        //console.log(this.receiveData);

        let coinKeys: any = Object.keys(this.receiveData);
        let coinValues: any = Object.values(this.receiveData);

        // Price compare first time check
        if (this.cryptoLastPrices.length === 0) {
          for (let _i = 0; _i < coinKeys.length; _i++) {
            this.cryptoLastPrices[_i] = parseFloat((coinValues[_i].USD.PRICE).substring(2).replace(/,/g, ''));
            this.cryptoPriceCompare[_i] = (parseFloat((coinValues[_i].USD.PRICE).substring(2).replace(/,/g, '')) -
              this.cryptoLastPrices[_i]);
          }
        } else {
          for (let _i = 0; _i < coinKeys.length; _i++) {
            this.cryptoPriceCompare[_i] = (parseFloat((coinValues[_i].USD.PRICE).substring(2).replace(/,/g, '')) -
              this.cryptoLastPrices[_i]);
          }
        }
        //console.log(this.cryptoLastPrices);

        for (let _i = 0; _i < coinKeys.length; _i++) {
          this.cryData[coinKeys[_i]] = {
            image1x: this.cryptoImages1x[_i],
            image2x: this.cryptoImages2x[_i],
            name: this.cryptoNames[_i],
            symbol: coinKeys[_i],
            price: coinValues[_i].USD.PRICE,
            marketCap: coinValues[_i].USD.MKTCAP,
            change24: coinValues[_i].USD.CHANGE24HOUR,
            change24Num: parseFloat((coinValues[_i].USD.CHANGE24HOUR).substring(2).replace(/,/g, '')),
            priceCompare: this.cryptoPriceCompare[_i]
          }

          this.cryptoLastPrices[_i] = parseFloat((coinValues[_i].USD.PRICE).substring(2).replace(/,/g, ''));
          this.cryptos = JSON.parse(JSON.stringify(Object.values(this.cryData)));

        }
        //console.log(Object.values(this.cryData));
        this._loading = false;
        this.setTimer();
      });
  }

  setTimer() {
    // set showloader to true to show colored div on view
    this.showloader = true;
    this.timer = Observable.timer(1500);

    this.subscription = this.timer.subscribe(() => {
      // set showloader to false to hide colored div from view after 1.5 seconds
      this.showloader = false;
    });
  }

  public get placeholder() {
    return this._placeHolderSafe;
  }

  // Input element Id added when focused
  addId() {
    this.input_id = "focusWidth";
  }
  // Input element Id removed when lost focus
  removeId() {
    this.input_id = "";
  }

  sendEvent = () => {
    (<any>window).ga('send', 'event', {
      eventCategory: 'Links and Buttons',
      eventLabel: 'CoinlistToDetail',
      eventAction: 'click',
      eventValue: 20
    });
  }

}
