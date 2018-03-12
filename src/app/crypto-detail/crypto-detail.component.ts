import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../data.service';
import { Chart } from 'chart.js';
import { Crypto, CryptoX } from '../crypto';

@Component({
  selector: 'app-crypto-detail',
  templateUrl: './crypto-detail.component.html',
  styleUrls: ['./crypto-detail.component.css']
})
export class CryptoDetailComponent implements OnInit {

  cryptox: CryptoX;
  private cryptoName: string;
  private cryptoPrice: number;
  private cryptoImage1x: string;
  private cryptoImage2x: string;

  private symbol: string;

  private chart: any;
  private selectedType: string;
  private timeLimit: number;
  private aggregate: number;

  private selectedIndex = 0;
  private tabs = [
    {
      name: '24 HOURS',
      index: 0,
      content: this.chart
    },
    {
      name: '7 DAYS',
      index: 1,
      content: this.chart
    },
    {
      name: '1 MONTH',
      index: 2,
      content: this.chart
    },
    {
      name: '1 YEAR',
      index: 3,
      content: this.chart
    }
  ];

  constructor(
    private _data: DataService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location
  ) { }

  ngOnInit() {
    
    this.symbol = this._route.snapshot.paramMap.get('symbol').toUpperCase();

    // Check if input symbol is valid or not
    if (this._data.getNameSingle(this.symbol) == null) {
      this._router.navigate(['/404']);
    } else {
      this.cryptoName = this._data.getNameSingle(this.symbol);

      this.cryptoImage1x = this._data.getImage1xSingle(this.symbol);
      this.cryptoImage2x = this._data.getImage2xSingle(this.symbol);

      this._data.getPriceSingle(this.symbol)
        .subscribe(res => {
          //console.log(res.USD);
          this.cryptoPrice = res.USD;

          this.cryptox = {
            image1x: this.cryptoImage1x,
            image2x: this.cryptoImage2x,
            name: this.cryptoName,
            symbol: this.symbol,
            price: this.cryptoPrice
          };
          //console.log(this.cryptox);
          this.drawChart("A", 1440, 15);
        });
    }

  }

  drawChart(type: string, timelimit: number, aggregate: number): any {
    // console.log(this.selectedIndex);
    if (this.chart != null) {
      this.chart.destroy();
    }
    // Set global chart config
    Chart.defaults.global.defaultFontFamily = '"Helvetica Neue For Number", -apple-system, Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif';
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
      draw: function (ease) {
        Chart.controllers.line.prototype.draw.call(this, ease);

        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
          var activePoint = this.chart.tooltip._active[0],
            ctx = this.chart.ctx,
            x = activePoint.tooltipPosition().x,
            topY = this.chart.scales['y-axis-0'].top,
            bottomY = this.chart.scales['y-axis-0'].bottom;

          // Draw veritical line
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#f7f7f7';
          ctx.stroke();
          ctx.restore();
        }
      }
    });

    // Chart params for diffrent types
    let priceChart: any, alldates: any, cryptoDates: any[];
    let prefix: string;
    let canvasID: string;
    switch (type) {
      case "A": {
        canvasID = "canvas-0";
        prefix = "histominute";
        break;
      }
      case "B": {
        canvasID = "canvas-1";
        prefix = "histohour";
        break;
      }
      case "C": {
        canvasID = "canvas-2";
        prefix = "histohour";
        break;
      }
      case "D": {
        canvasID = "canvas-3";
        prefix = "histoday";
        break;
      }
    }

    this._data.getHitoricalPrices(this.symbol, prefix, timelimit, aggregate)
      .subscribe(res => {
        //console.log(res.Data);
        //console.log(res.Data.length());
        priceChart = res['Data'].map(res => res.close);
        alldates = res['Data'].map(res => res.time);
        //console.log(priceChart);

        cryptoDates = [];
        alldates.forEach((res) => {
          let jsdate = new Date(res * 1000);
          cryptoDates.push(jsdate.toLocaleTimeString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }));
        });

        // Draw new chart
        this.chart = new Chart(canvasID, {
          type: 'LineWithLine',
          data: {
            labels: cryptoDates,
            datasets: [
              {
                data: priceChart,
                borderColor: '#60acf3',
                cubicInterpolationMode: 'monotone',
                fill: false
              }
            ]
          },
          options: this.chartOptions
        });

      });

  }

  // Back to last location and send Google Analytics click events
  goBack(): void {
    (<any>window).ga('send', 'event', {
      eventCategory: 'Links and Buttons',
      eventLabel: 'Go Back',
      eventAction: 'click',
      eventValue: 30
    });
    this._location.back();
  }

  // Change params when tabs clicked
  selectChange() {
    switch (this.selectedIndex) {
      case 0: {
        this.selectedType = "A";
        this.timeLimit = 1440;
        this.aggregate = 15;
        this.drawChart(this.selectedType, this.timeLimit, this.aggregate);
        break;
      }
      case 1: {
        this.selectedType = "B";
        this.timeLimit = 168;
        this.aggregate = 1;
        this.drawChart(this.selectedType, this.timeLimit, this.aggregate);
        break;
      }
      case 2: {
        this.selectedType = "C";
        this.timeLimit = 720;
        this.aggregate = 10;
        this.drawChart(this.selectedType, this.timeLimit, this.aggregate);
        break;
      }
      case 3: {
        this.selectedType = "D";
        this.timeLimit = 365;
        this.aggregate = 2;
        this.drawChart(this.selectedType, this.timeLimit, this.aggregate);
        break;
      }
    }
  }

  // Define chart options
  private chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 50,
        bottom: 0
      }
    },
    tooltips: {
      mode: 'label',
      intersect: false,
      titleFontColor: "#7289a1",
      bodyFontSize: 14,
      bodyFontStyle: "bold",
      bodySpacing: 6,
      yPadding: 8,
      custom: function (tooltip) {
        // remove color square label
        if (!tooltip) return;
        // disable displaying the color box;
        tooltip.displayColors = false;
      },
      callbacks: {
        label: function (tooltipItem, data) {
          // Add a dollar sign, rounding, and thousands commas
          return "$ " + Number(tooltipItem.yLabel).toFixed(2).replace(/./g, function (c, i, a) {
            return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
          });
        }
      }
    },
    elements: {
      point: {
        radius: 0,
        borderWidth: 2,
        hitRadius: 8,
        hoverRadius: 6
      }
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        display: true,
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5,
          maxRotation: 0,
          fontSize: 12,
          fontStyle: "bold",
          fontColor: "#7289a1",
          padding: 8
        },
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        position: 'right',
        display: true,
        gridLines: {
          drawBorder: false,
        },
        ticks: {
          // Include a $ sign in the ticks and 
          callback: function (value, index, values) {
            return '$ ' + Number(value).toFixed(2);;
          },
          autoSkip: true,
          maxTicksLimit: 5,
          fontSize: 12,
          fontStyle: "bold",
          padding: 10
        },
      }],
    }
  };

}
