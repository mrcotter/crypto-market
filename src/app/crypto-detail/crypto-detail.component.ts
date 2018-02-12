import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  private cryptox: CryptoX;
  private cryptoName: string;
  private cryptoPrice: number;
  private cryptoImage1x: string;
  private cryptoImage2x: string;

  private symbol: string;

  private chart: any;
  private time24hLimit: number = 1440;

  constructor(
    private _data: DataService,
    private _route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit() {
    this.symbol = this._route.snapshot.paramMap.get('symbol').toUpperCase();
    //console.log( this.crypto == null );

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
        this.drawChart();

      });
  }

  drawChart(): any {
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

          // draw line
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

    let priceChart: any, alldates: any, cryptoDates: any[];

    this._data.getMinutePrices(this.symbol, this.time24hLimit)
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
        this.chart = new Chart('canvas', {
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
          options: {
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
                  fontColor: "#7289a1"
                },
                gridLines: {
                  display: false
                }
              }],
              yAxes: [{
                position: 'right',
                display: true,
                ticks: {
                  // Include a $ sign in the ticks
                  callback: function (value, index, values) {
                    return '$ ' + value;
                  },
                  autoSkip: true,
                  maxTicksLimit: 5,
                  fontSize: 12,
                  fontStyle: "bold"
                },
              }],
            }
          }
        });
      });

  }

  goBack(): void {
    this._location.back();
  }

}
