import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';

@Component({
  selector: 'app-crypto-price',
  templateUrl: './crypto-price.component.html',
  styleUrls: ['./crypto-price.component.css']
})
export class CryptoPriceComponent implements OnInit {

  private cryptos: any;
  private receiveData: any;
  private cryptoNames: string[];
  private cryptoImages1x: string[];
  private cryptoImages2x: string[];
  private cryptoLastPrices: number[];
  private cryptoPriceCompare: number[];

  public showloader: boolean = false;      
  private subscription: Subscription;
  private timer: Observable<any>;

  constructor(private _data: DataService) {
    this.cryptoNames = this._data.getNamesFull();
    this.cryptoImages1x = this._data.getImages1xFull();
    this.cryptoImages2x = this._data.getImages2xFull();
    this.cryptoLastPrices = [];
    this.cryptoPriceCompare = [];
  }

  ngOnInit() {
    this._data.getPricesFull()
      .subscribe(res => {
        this.receiveData = res.DISPLAY;

        let cryData: any[] = [];
        let coinKeys = Object.keys(this.receiveData);
        let coinValues = Object.values(this.receiveData);
        //console.log(this.cryptoLastPrices.length);

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
          cryData[_i] = {
            Image1x: this.cryptoImages1x[_i],
            Image2x: this.cryptoImages2x[_i],
            Name: this.cryptoNames[_i],
            Key: coinKeys[_i],
            Price: coinValues[_i].USD.PRICE,
            MarketCap: coinValues[_i].USD.MKTCAP,
            Change24: coinValues[_i].USD.CHANGE24HOUR,
            Change24Num: parseFloat((coinValues[_i].USD.CHANGE24HOUR).substring(2).replace(/,/g, '')),
            PriceCompare: this.cryptoPriceCompare[_i]
          }

          this.cryptoLastPrices[_i] = parseFloat((coinValues[_i].USD.PRICE).substring(2).replace(/,/g, ''));
          this.cryptos = JSON.parse(JSON.stringify(Object.values(cryData)));
        }
        //console.log(this.cryptoPriceCompare);
        this.setTimer();
      });
  }

  setTimer() {
    // set showloader to true to show loading div on view
    this.showloader = true;
    this.timer = Observable.timer(1500);

    this.subscription = this.timer.subscribe(() => {
      // set showloader to false to hide loading div from view after 1 seconds
      this.showloader = false;
    });
  }

}
