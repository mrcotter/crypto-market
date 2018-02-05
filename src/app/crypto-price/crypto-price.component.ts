import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

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

  constructor(private _data: DataService) {
    this.cryptoNames = this._data.getNamesFull();
    this.cryptoImages1x = this._data.getImages1xFull();
    this.cryptoImages2x = this._data.getImages2xFull();
  }

  ngOnInit() {
    this._data.getPricesFull()
      .subscribe(res => {
        this.receiveData = res.DISPLAY;

        let cryData: any[] = [];
        let coinKeys = Object.keys(this.receiveData);
        let coinValues = Object.values(this.receiveData);
        //console.log(cryptos);
        for (let _i = 0; _i < coinKeys.length; _i++) {
          cryData[_i] = {
            Image1x: this.cryptoImages1x[_i],
            Image2x: this.cryptoImages2x[_i],
            Name: this.cryptoNames[_i],
            Key: coinKeys[_i],
            Price: coinValues[_i].USD.PRICE,
            MarketCap: coinValues[_i].USD.MKTCAP,
            Change24: coinValues[_i].USD.CHANGE24HOUR
          }
          this.cryptos = JSON.parse(JSON.stringify(Object.values(cryData)));
        }
        //console.log(this.cryptos);
      });
  }

}
