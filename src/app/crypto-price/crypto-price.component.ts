import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-crypto-price',
  templateUrl: './crypto-price.component.html',
  styleUrls: ['./crypto-price.component.css']
})
export class CryptoPriceComponent implements OnInit {

  objectKeys = Object.keys;
  receiveData: any;
  cryptos: any[] = [];

  constructor(private _data: DataService) {}

  ngOnInit() {
    this._data.getPricesFull()
      .subscribe(res => {
        this.receiveData = res.DISPLAY;
        let coinKeys = Object.keys(this.receiveData);
        let coinValues = Object.values(this.receiveData);

        for (let _i = 0; _i < coinKeys.length; _i++) { 
          this.cryptos[_i] = {
            cryptoKey: coinKeys[_i],
            cryptoPrice: coinValues[_i].USD.PRICE
          };
        }
        //console.log(typeof(Object.keys(this.cryptos)));
      });
  }

}
