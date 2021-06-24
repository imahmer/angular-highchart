import { Component, OnInit } from '@angular/core';
import { FacadeService } from '../common/services/facade.service';
import * as Highcharts from "highcharts/highmaps";
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  Highcharts;
  chartConstructor = "mapChart";
  chartOptions;
  drilldown: any;
  properties: any;

  constructor(private facadeService: FacadeService) { }

  ngOnInit() {
    this.Highcharts = Highcharts;

    const usMapData = require("@highcharts/map-collection/countries/us/us-all.geo.json");
    const usMap = Highcharts.geojson(usMapData);

    // Set a random value on map
    usMap.forEach((el: any, i) => {
      el.value = i;
      el.drilldown = el.properties["hc-key"];
    });
    this.chartOptions = {
      chart: {
        height: (8 / 16) * 100 + "%",
        events: {
          drilldown(e) {
            console.log(e.point.drilldown)
            const chart = this as any;
            const mapKey = "countries/us/" + e.point.drilldown + "-all";
            const mapData = require(`@highcharts/map-collection/${mapKey}.geo.json`);
            const provinceData = Highcharts.geojson(mapData);
            // Set a random value on map
            provinceData.forEach((el: any, i) => {
              el.value = i;
            });

            chart.addSeriesAsDrilldown(e.point, {
              name: e.point.name,
              data: provinceData,

              dataLabels: {
                enabled: true
              }
            });

            chart.setTitle(null, { text: e.point.name });
          },
          drillup() {
            const chart = this as any;
          }
        }
      },
      title: {
        text: "Title goes here"
      },
      colorAxis: {
        min: 0,
        minColor: "#E6E7E8",
        maxColor: "#417BCC"
      },

      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: "bottom"
        }
      },
      plotOptions: {
        map: {
          states: {
            hover: {
              color: "#F8BA03"
            }
          }
        },
        series:{
          point:{
              events:{
                  click: function(e){
                      if(e.point.name != null)
                        console.log(e.point.name)
                    }
                }
            }
        }
      },
      series: [
        {
          animation: {
              duration: 1000
          },
          name: "United States",
          data: usMap,
          dataLabels: {
              enabled: true,
              color: '#FFFFFF',
              format: '{point.drilldown}',
              style: {
                textTransform: 'uppercase',
              }
          },
        }
      ],
      drilldown: {}
    };
  }
}
