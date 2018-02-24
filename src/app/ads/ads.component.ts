import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit() {
    setTimeout(()=>{
      try{
        (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
      }catch(e){
        console.error("error");
      }
    },2000);
  }


}
