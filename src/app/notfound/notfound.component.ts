import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  sendEvent = () => {
    (<any>window).ga('send', 'event', {
      eventCategory: 'Links and Buttons',
      eventLabel: '404backtohome',
      eventAction: 'click',
      eventValue: 10
    });
  }

}
