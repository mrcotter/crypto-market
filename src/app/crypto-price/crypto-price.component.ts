import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-crypto-price',
  templateUrl: './crypto-price.component.html',
  styleUrls: ['./crypto-price.component.css']
})
export class CryptoPriceComponent implements OnInit {

  private objectKeys = Object.keys;
  private receiveData: any;
  private cryptos: any[] = [];
  private cryptoNames: string[];
  private cryptoImages1x: string[];
  private cryptoImages2x: string[];

  constructor(private _data: DataService) {
    this.cryptoNames = this._data.getNamesFull();
    this.cryptoImages1x = this._data.getImages1xFull();
    this.cryptoImages2x = this._data.getImages2xFull();
  }

  ngOnInit() {
    this._data.getPricesFull()
      .subscribe(res => {
        this.receiveData = res.DISPLAY;

        let coinKeys = Object.keys(this.receiveData);
        let coinValues = Object.values(this.receiveData);
        //console.log(typeof(coinKeys[0]));
        //console.log(this.cryptoImages1x);
        for (let _i = 0; _i < coinKeys.length; _i++) {
          this.cryptos[_i] = {
            Image1x: this.cryptoImages1x[_i],
            Image2x: this.cryptoImages2x[_i],
            Name: this.cryptoNames[_i],
            Key: coinKeys[_i],
            Price: coinValues[_i].USD.PRICE,
            MarketCap: coinValues[_i].USD.MKTCAP,
            Change24: coinValues[_i].USD.CHANGE24HOUR
          };
        }
        //console.log(typeof(Object.keys(this.cryptos)));
      });
  }

}
