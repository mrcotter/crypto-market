import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DataService } from '../data.service';
import { Chart } from 'chart.js';
import { Crypto } from '../crypto';

@Component({
  selector: 'app-crypto-detail',
  templateUrl: './crypto-detail.component.html',
  styleUrls: ['./crypto-detail.component.css']
})
export class CryptoDetailComponent implements OnInit {
  @Input() crypto: Crypto;

  private chart: any;
  private timeLimit: number = 1440;

  constructor(private _data: DataService) { }

  ngOnInit() {
    // Set global chart config
    Chart.defaults.global.defaultFontFamily = '"Helvetica Neue For Number", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif';
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
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(this.crypto.Key);
    if (this.crypto != null) {

      this._data.getMinutePrices(this.crypto.Key, this.timeLimit)
        .subscribe(res => {
          //console.log(res.Data);
          //console.log(res.Data.length());
          let price = res['Data'].map(res => res.close);
          let alldates = res['Data'].map(res => res.time);

          let cryptoDates = [];
          alldates.forEach((res) => {
            let jsdate = new Date(res * 1000);
            cryptoDates.push(jsdate.toLocaleTimeString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }));
          });

          // Destroy previous chart
          if (this.chart != null) {
            this.chart.destroy();
          }

          // Draw new chart
          this.chart = new Chart('canvas', {
            type: 'LineWithLine',
            data: {
              labels: cryptoDates,
              datasets: [
                {
                  data: price,
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
                    return "$" + Number(tooltipItem.yLabel).toFixed(2).replace(/./g, function (c, i, a) {
                      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                    });
                  }
                }
              },
              elements: {
                point: {
                  radius: 0,
                  hitRadius: 8,
                  hoverRadius: 8
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
                    maxRotation: 0
                  },
                  gridLines: {
                    display: false
                  }
                }],
                yAxes: [{
                  display: true,
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 5
                  },
                }],
              }
            }
          });

        });
    }
  }

}
