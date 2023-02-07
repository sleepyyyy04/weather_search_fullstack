/// <reference types="@types/googlemaps" />
import {Component, HostBinding, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import * as $ from 'jquery';
import * as Highcharts from 'highcharts';
import {interval, Subscription} from "rxjs";
// import {google} from 'google-maps';
import {animation, state, style, transition, trigger, keyframes, animate} from "@angular/animations";
import {FormsModule} from "@angular/forms";
import {newArray} from "@angular/compiler/src/util";
// import {strict} from "assert";
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
let Windbarb = require('highcharts/modules/windbarb');
Boost(Highcharts);
Windbarb(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({ transform: 'translateX(-100%)' }))
      ])
    ]),
    trigger('flyInOut2', [
      state('in2', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({ transform: 'translateX(100%)' }))
      ])
    ])


    // trigger('left-mid', [
    //   state('left', style({transform: 'translateX(-100%)'})),
    //   state('center', style({transform: 'translateX(0)'})),
    //
    //   transition('left => center', [
    //     animate('1s')
    //   ]),
    //     transition(' center => left', [
    //       animate('1s')
    //     ]),
    //   ]),
    // trigger('mid-right', [
    //   state('right', style({transform: 'translateX(100%)'})),
    //   state('center1', style({transform: 'translateX(0)'})),
    //
    //   transition('right => center1', [
    //     animate('1s')
    //   ]),
    //   transition('center1 => right', [
    //     animate('1s')
    //   ]),
    // ])
  ]
})

export class AppComponent implements OnInit{

  title = 'hw8';
  getLocation: boolean=false;
  getLock: boolean=false;
  disshow: boolean=true;
  validshow: boolean=true;
  showbar: boolean=false;
  showcontent: boolean=true;
  showcontentin: boolean=false;
  showDetail: boolean=false;
  detailButton: boolean=true;
  noResult: boolean=false;
  resultState='middle';
  detailState='right';

  searchForm={
    street: '',
    city: '',
    state: ''
  }
  // myControl=new FormControl();
  autocity: Array<string>=[];
  autostate: Array<string>=[];
  // streetControl=new FormControl();
  haveFavorite:boolean=false;

  constructor(private http: HttpClient) { }

  localCity: Array<string>=[];
  localState: Array<string>=[];

  inFavorite() {
    this.localCity=[];
    this.localState=[];
    if (localStorage.length!=0){
      console.log('local length 0');
      this.haveFavorite=true;
    }
    else
      this.haveFavorite=false;
    for(var i=0; i<localStorage.length; i++) {
      var ikey =localStorage.key(i);
      console.log(ikey);
      if (ikey != null) {
        var ivalues = localStorage.getItem(ikey);
        console.log(ivalues)
        if (ivalues != null) {
          var jsonvalue = JSON.parse(ivalues);
          console.log(jsonvalue)
          this.localCity.push(jsonvalue[0]["city"]);
          console.log('push city')
          console.log(jsonvalue[0]["city"])
          this.localState.push(jsonvalue[0].state);
        }

      }

    }
  }

  trashFavorite(i: number) {
    var ikey =localStorage.key(i);
    console.log(ikey);
    if (ikey != null) {
      localStorage.removeItem(ikey);
      // this.localCity.splice(i,1);
      // this.localState.splice(i, 1);
      if (ikey==this.lat+','+this.lon) {
        this.isFavorite=false;
      }
    }
    this.inFavorite();
  }

  st ='';
  onselect(val: any) {
    this.st=this.autostate[this.autocity.indexOf(val)];
    console.log(this.st);
    $('#state option[value="'+this.st+'"]').attr("selected", "selected");
    this.autocity=[];
    this.autostate=[];
  }

  getAuto(loc:any) {
    console.log('getauto!'+loc);
    if (loc!='' && loc !=null) {
      // var http_auto='http://127.0.0.1:3000/auto?loc='+loc;
      var http_auto='https://backnode-93958.ue.r.appspot.com/auto?loc='+loc;
      this.http.get(http_auto).subscribe(response =>{
        console.log(response);
        var data=JSON.parse(JSON.stringify(response));
        this.autocity=[];
        this.autostate=[];
        for (var i=0; i<data["predictions"].length; i++) {
          this.autocity.push(data["predictions"][i]["terms"][0]["value"]);
          this.autostate.push(data["predictions"][i]["terms"][1]["value"]);
        }
      })
    }
    else {
      this.autocity=[];
      this.autostate=[];
    }
  }

  autoDetect() {
    if ($('#checkbox-ok').is(':checked')) {
      this.getLocation=true;
      this.getLock=true;
      this.disshow=false;
      this.validshow=false;
      $('#state').val('');
      $('input[type=text]').val('');
    }
    else {
      this.getLocation=false;
      this.getLock=false;
      this.disshow=true;
      this.validshow=true;
    }
  }

  lat='';
  lat_num=0;
  lon='';
  lon_num=0;
  cstreet='';
  ccity='';
  cstate='';
  locationkey="https://ipinfo.io?token=3a5ed5e939230a";
  map_key='AIzaSyAp3S2F2HGiXRNsaLzYmDZjms5j3LiLsq0'
  isFavorite: boolean=false;
  favoriteDetail: boolean=true;

  onSubmit() {
    this.noResult=false;
    this.isFavorite=false;
    this.showbar=true;
    if ($('#checkbox-ok').is(':checked')) {
      this.http.get(this.locationkey).subscribe(response =>{
        console.log(response);
        var data=JSON.parse(JSON.stringify(response));
        this.ccity=data["city"];
        this.cstate=data["region"];
        var loccode=data["loc"];
        var lat_lon=loccode.split(",");
        this.lat=lat_lon[0];
        this.lon=lat_lon[1];
        console.log(this.lat);
        console.log(this.lon);
        this.askfor();
      });
    }
    else {
      this.cstreet=this.searchForm.street;
      this.ccity=($('#city').val() as string);
      this.cstate=$('#state option:selected').text();
      if (this.cstate=='Select your state'){
        var address=this.cstreet.replace(" ", "+")+"+"+this.ccity.replace(" ", "+");
      }else {
        var address=this.cstreet.replace(" ", "+")+"+"+this.ccity.replace(" ", "+")+"+"+this.cstate;

      }
      var mapURL="https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key="+this.map_key;
      this.http.get(mapURL).subscribe(response =>{
        console.log(response);
        var data=JSON.parse(JSON.stringify(response));
        if (data.results.length==0){
          console.log('no result');
          this.showbar=false;
          this.noResult=true;
        }
        else {
          this.lat=data["results"][0]["geometry"]["location"]["lat"];
          this.lon=data["results"][0]["geometry"]["location"]["lng"];
          console.log(this.lat);
          console.log(this.lon);
          this.askfor();
        }
      });
    }
  }

  askfor() {
    if (!this.noResult) {
      console.log('call for tommo back')
      // var http_check='http://127.0.0.1:3000/back?lat='+this.lat+'&lon='+this.lon;
      var http_check='https://backnode-93958.ue.r.appspot.com/back?lat='+this.lat+'&lon='+this.lon;
      console.log(http_check);

      this.http.get(http_check).subscribe(response =>{
        console.log(response);
        // this.showResult(response, cstreet, ccity, cstate);
        setTimeout(() => {this.showResult(response, this.cstreet, this.ccity, this.cstate);}, 1000);
      });
    }
  }

  freshResult(lat:string, lon: string) {
    console.log(lat);
    console.log(lon)
    if(typeof (localStorage.getItem(lat+','+lon)) != 'undefined'&&localStorage.getItem(lat+','+lon) !=null) {
      // console.log(localStorage.getItem(lat+','+lon))
      this.isFavorite=true;
    }else {
      // console.log(localStorage.getItem(lat+','+lon))
      this.isFavorite=false;
    }
  }

  date: Array<string>=[];
  code: Array<number>=[];
  highT: Array<number>=[];
  lowT: Array<number>=[];
  windS: Array<number>=[];
  apprentT: Array<number>=[];
  sunR: Array<string>=[];
  sunS: Array<string>=[];
  humidity: Array<number>=[];
  visibility: Array<number>=[];
  cloudC: Array<number>=[];
  moonF: Array<number>=[];
  pics: Array<string>=[];
  picsName: Array<string>=[];
  head='';
  dateline1: Array<string>=[];
  jdata: any;
  favo_base: any;
  week=new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");

  showResult(jjdata: object, cstreet: string, ccity: string, cstate: string) {
    this.jdata=JSON.parse(JSON.stringify(jjdata));
    var day_base=this.jdata["data"]["timelines"][1]["intervals"];
    this.favo_base=day_base;
    for (var i=0; i<15; i++) {
      this.dateline1[i]=day_base[i]["startTime"];
      var transf=new Date(this.dateline1[i].substring(0,19));
      this.date[i]=this.week[transf.getDay()]+", "+transf.toString().substring(8,11)+transf.toString().substring(4,8)+transf.toString().substring(11,15);
      this.code[i]=day_base[i]["values"]["weatherCode"];
      this.pics[i]=this.picShow(this.code[i]);
      this.picsName[i]=this.picCode(this.code[i]);
      this.highT[i]=day_base[i]["values"]["temperatureMax"];
      this.lowT[i]=day_base[i]["values"]["temperatureMin"];
      this.windS[i]=day_base[i]["values"]["windSpeed"];
      this.apprentT[i]=day_base[i]["values"]["temperatureApparent"];
      this.sunR[i]=day_base[i]["values"]["sunriseTime"];
      this.sunS[i]=day_base[i]["values"]["sunsetTime"];
      this.humidity[i]=day_base[i]["values"]["humidity"];
      this.visibility[i]=day_base[i]["values"]["visibility"];
      this.cloudC[i]=day_base[i]["values"]["cloudCover"];
      this.moonF[i]=day_base[i]["values"]["moonPhase"];
    }
    this.favo_base[0]["city"]=ccity;
    this.favo_base[0]["state"]=cstate;
    this.showbar=false;
    this.showcontent=true;
    this.showcontentin=true;
    this.lat_num=Number(this.lat);
    console.log('number')
    console.log(this.lat)
    this.lon_num=Number(this.lon);
    console.log(this.lat)
    console.log(this.lon)
    this.freshResult(this.lat,this.lon);
    if (cstate=='Select your state')
      var thead='Forecast at '+ cstreet +', '+ ccity;
    else
      var thead='Forecast at '+ cstreet +', '+ ccity +', '+cstate;
    this.head=thead;
    this.favo_base[0]["head"]=this.head;
    this.showChart1();
    this.showChart2();
  }

  fhead='';
  fdate: Array<string>=[];
  fcode: Array<number>=[];
  fhighT: Array<number>=[];
  flowT: Array<number>=[];
  fwindS: Array<number>=[];
  fpics: Array<string>=[];
  fpicsName: Array<string>=[];

  freshDetail(i: number) {
    var ikey =localStorage.key(i);
    console.log(ikey);
    if (ikey != null) {
      var ivalues = localStorage.getItem(ikey);
      console.log(ivalues)
      if (ivalues != null) {
        var jsonvalue = JSON.parse(ivalues);
        this.fhead = jsonvalue[0]["head"];
        for (var i=0; i<15; i++) {
          var tempdate=jsonvalue[i]["startTime"];
          var transf=new Date(tempdate.substring(0,19));
          this.fdate[i]=this.week[transf.getDay()]+", "+transf.toString().substring(8,11)+transf.toString().substring(4,8)+transf.toString().substring(11,15);
          this.fcode[i]=jsonvalue[i]["values"]["weatherCode"];
          this.fpics[i]=this.picShow(this.fcode[i]);
          this.fpicsName[i]=this.picCode(this.fcode[i]);
          this.fhighT[i]=jsonvalue[i]["values"]["temperatureMax"];
          this.flowT[i]=jsonvalue[i]["values"]["temperatureMin"];
          this.fwindS[i]=jsonvalue[i]["values"]["windSpeed"];
        }
      }
    }
    this.favoriteDetail=false;
  }

  backtoFavorite() {
    this.favoriteDetail=true;
  }

  addFavorite() {
    this.isFavorite=true;
    console.log(this.favo_base)
    localStorage.setItem(this.lat+','+this.lon, JSON.stringify(this.favo_base));

  }

  deleteFavorite() {
    this.isFavorite=false;
    localStorage.removeItem(this.lat+','+this.lon);
  }

  dstatus='';
  ddate='';
  dmaxT='';
  dminT='';
  dapparentT='';
  dsunR='';
  dsunS='';
  dhumidity='';
  dwindS='';
  dvisi='';
  dmoon=0;
  dcloud='';
  tweet='';
  getDetail(ind: number) {
    console.log(ind);
    this.ddate=this.date[ind];
    this.dstatus=this.picsName[ind];
    this.dmaxT=this.highT[ind]+' °F';
    this.dminT=this.lowT[ind] +' °F';
    this.dapparentT=this.apprentT[ind] +' °F';
    this.dsunR=this.sunR[ind].substring(11,19);
    this.dsunS=this.sunS[ind].substring(11,19);
    this.dhumidity=this.humidity[ind]+' %';
    this.dwindS=this.windS[ind]+' mph';
    this.dvisi=this.visibility[ind]+' mi';
    this.dmoon=this.moonF[ind];
    this.dcloud=this.cloudC[ind]+' %';
    this.showcontent=false;
    this.showDetail=true;
    this.detailButton=false;
    this.resultState='left';
    this.detailState='center';
    this.tweet="The temperature in "+ this.ccity+", "+this.cstate+" on "+this.ddate
      +" is "+this.dapparentT+". The weather conditions are "+this.dstatus
    +"&hashtags=CSCI571WeatherForecast";
    console.log(this.lat_num);
    console.log(this.lon_num);
  }

  backList() {
    this.showcontent=true;
    this.showDetail=false;
  }
  backDetail() {
    this.showcontent=false;
    this.showDetail=true;
  }
  openTweet() {
    var turl="https://twitter.com/intent/tweet?text="+this.tweet;
    var newTab=window.open(turl, '_blank');
  }

  Highcharts = Highcharts;
  chartOptions1: any={};
  showChart1(){
    var Data1: number[][]=[[new Date(this.dateline1[0]).valueOf(), this.lowT[0], this.highT[0]]];
    for (var i=1; i<15; i++) {
      Data1.push([new Date(this.dateline1[i]).valueOf(), this.lowT[i], this.highT[i]]);
    }
    var chartOptions: any = {
      chart: {
        type: 'arearange',
        zoomType: 'x',
        scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1
        }
      },
      title: {
        text: 'Temperature Range (Min, Max)'
      },
      xAxis: {
        type: 'datetime',
        crosshair: true,
        dateTimeLabelFormats: {
          day: "%e %b",
          week: "%e %b",
          month: "%e %b",
          year: "%e %b"
        },
        tickInterval: 0
      },
      yAxis: {
        title: {
          text: null
        }
      },
      plotOptions:{
        arearange:{
          color: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, "#f7a35c"],
              [1, Highcharts.color("#7cb5ec").setOpacity(0).get('rgba')]
            ],
            fillOpacity: 0.2
          }
        }
      },
      tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: '°F',
        xDateFormat: '%A, %b %e'
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Temperatures',
        data: Data1,
        lineColor: "#f7a35c",
        lineWidth:1,
        marker: {
          fillColor:"#7cb5ec",
          lineWidth: 1,
          lineColor: "#7cb5ec"
        }
      }]
    };
    this.chartOptions1=chartOptions;
  }

  chartOptions2: any={};
  showChart2(){
    var humid: Array<object>=[];
    var winds: Array<object>=[];
    var temper: Array<object>=[];
    var press: Array<object>=[];
    console.log(this.jdata)
      // Loop over hourly (or 6-hourly) forecasts
      this.jdata.data.timelines[0].intervals.forEach((node : any, i : number) => {
        const x=Date.parse(node.startTime.substring(0,19)+'Z')
        temper.push({ x, y: node.values.temperature});
        humid.push({ x, y: Math.round(node.values.humidity)});
        if (i % 2 === 0) {
          winds.push({ x, value: node.values.windSpeed,
            direction: node.values.windDirection });
        }
        press.push({ x, y: node.values.pressureSeaLevel});
      });
    var chartOptions: any =  {
        chart: {
          renderTo: "menu3",
          marginBottom: 70,
          marginRight: 40,
          marginTop: 50,
          plotBorderWidth: 1,
          // height: 310,
          alignTicks: false,
          scrollablePlotArea: {
            minWidth: 720
          }
        },
        title: {
          text: 'Hourly Weather (For Next 5 Days)',
          align: 'center',
          style: {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }
        },
        credits: {
          text: 'Forecast',
          position: {
            x: -40
          }
        },
        tooltip: {
          shared: true,
          useHTML: true,
          headerFormat:
            '<small>{point.x:%A, %b %e, %H:%M}</small><br>'

        },
        xAxis: [{ // Bottom X axis
          type: 'datetime',
          tickInterval: 2 * 36e5, // two hours
          minorTickInterval: 36e5, // one hour
          tickLength: 0,
          gridLineWidth: 1,
          gridLineColor: 'rgba(128, 128, 128, 0.1)',
          startOnTick: false,
          endOnTick: false,
          minPadding: 0,
          maxPadding: 0,
          offset: 30,
          showLastLabel: true,
          labels: {
            format: '{value:%H}'
          },
          crosshair: true
        }, { // Top X axis
          linkedTo: 0,
          type: 'datetime',
          tickInterval: 24 * 3600 * 1000,
          labels: {
            format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
            align: 'left',
            x: 3,
            y: -5
          },
          opposite: true,
          tickLength: 20,
          gridLineWidth: 1
        }],
        yAxis: [{ // temperature axis
          title: {
            text: null
          },
          labels: {
            format: '{value}°',
            style: {
              fontSize: '10px'
            },
            x: -3
          },
          plotLines: [{ // zero plane
            value: 0,
            color: '#BBBBBB',
            width: 1,
            zIndex: 2
          }],
          maxPadding: 0.3,
          minRange: 8,
          tickInterval: 1,
          gridLineColor: 'rgba(128, 128, 128, 0.1)'
        }, { // humidity axis
          title: {
            text: null
          },
          labels: {
            enabled: false
          },
          gridLineWidth: 0,
          tickLength: 0,
          minRange: 10,
          min: 0
        }, { // pressure
          allowDecimals: false,
          title: { // Title on top of axis
            text: 'inHg',
            offset: 0,
            align: 'high',
            rotation: 0,
            style: {
              fontSize: '10px',
              color: "#f7a35c"
            },
            textAlign: 'left',
            x: 3
          },
          labels: {
            style: {
              fontSize: '8px',
              color: "#f7a35c"
            },
            y: 2,
            x: 3
          },
          gridLineWidth: 0,
          opposite: true,
          showLastLabel: false
        }],
        legend: {
          enabled: false
        },
        plotOptions: {
          series: {
            pointPlacement: 'between'
          }
        },
        series: [{
          name: 'Temperature',
          data: temper,
          type: 'spline',
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true
              }
            }
          },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
              '{series.name}: <b>{point.y}°F</b><br/>'
          },
          zIndex: 1,
          color: '#FF3333',
          negativeColor: '#48AFE8'
        },
          {
            name: 'Humidity',
            data: humid,
            type: 'column',
            color: '#68CFE8',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            grouping: false,
            dataLabels: {
              enabled: true,
              filter: {
                operator: '>',
                property: 'y',
                value: 0
              },
              style: {
                fontSize: '8px',
                color: 'gray'
              }
            },
            tooltip: {
              valueSuffix: ' %'
            }
          }, {
            name: 'Air pressure',
            color: "#f7a35c",
            data: press,
            marker: {
              enabled: false
            },
            shadow: false,
            tooltip: {
              valueSuffix: ' inHg'
            },
            dashStyle: 'shortdot',
            yAxis: 2
          }, {
            name: 'Wind',
            type: 'windbarb',
            id: 'windbarbs',
            color: "red",
            lineWidth: 1.5,
            data: winds,
            vectorLength: 18,
            yOffset: -15,
            tooltip: {
              valueSuffix: ' mph'
            }
          }]
      };
    this.chartOptions2=chartOptions;
    };

  resetc() {
    $('#a-favorite').removeClass('active');
    $('#favorite-card').removeClass('active');
    $('#a-result').addClass('active');
    $('#result-card').addClass('active');

    $('#state option[value="'+this.st+'"]').removeAttr("selected");
    $('#state option[value=""]').attr("selected", "selected");
    this.showcontent=true;
    this.showcontentin=false;
    this.getLocation=false;
    this.getLock=false;
    this.disshow=true;
    this.validshow=true;
    this.showDetail=false;
    this.detailButton=true;
    this.noResult=false;
    console.log(this.searchForm.state)
    console.log(this.searchForm.city)
  }

  picShow(wcode: number) {
    if(wcode==4201) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/rain_heavy.svg";
    }
    else if(wcode==4001) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/rain.svg";
    }
    else if(wcode==4200) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/rain_light.svg";
    }
    else if(wcode==6201) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/freezing_rain_heavy.svg";
    }
    else if(wcode==6001) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/freezing_rain.svg";
    }
    else if(wcode==6200) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/freezing_rain_light.svg";
    }
    else if(wcode==6000) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/freezing_drizzle.svg";
    }
    else if(wcode==4000) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/drizzle.svg";
    }
    else if(wcode==7101) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/ice_pellets_heavy.svg";
    }
    else if(wcode==7000) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/ice_pellets.svg";
    }
    else if(wcode==7102) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/ice_pellets_light.svg";
    }
    else if(wcode==5101) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/snow_heavy.svg";
    }
    else if(wcode==5000) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/snow.svg";
    }
    else if(wcode==5100) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/snow_light.svg";
    }
    else if(wcode==5001) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/flurries.svg";
    }
    else if(wcode==8000) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/tstorm.svg";
    }
    else if(wcode==2100) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/fog_light.svg";
    }
    else if(wcode==2000) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/fog.svg";
    }
    else if(wcode==1001) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/cloudy.svg";
    }
    else if(wcode==1102) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/mostly_cloudy.svg";
    }
    else if(wcode==1101) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/partly_cloudy_day.svg";
    }
    else if(wcode==1100) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/mostly_clear_day.svg";
    }
    else if(wcode==1000) {
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/clear_day.svg";
    }
    else if(wcode==3000) {
      return "https://raw.githubusercontent.com/sleepyyyy04/resourse/main/wind.svg";
    }
    else if(wcode==3001) {
      return "https://raw.githubusercontent.com/sleepyyyy04/resourse/main/light_wind.svg";
    }
    else if(wcode==3002) {
      return "https://raw.githubusercontent.com/sleepyyyy04/resourse/main/strong_wind.svg";
    }
    else
      return "https://raw.githubusercontent.com/Tomorrow-IO-API/tomorrow-weather-codes/master/color/clear_day.svg";
  }

  picCode(wcode: number) {
    if(wcode==4201) {
      return "Heavy Rain";
    }
    else if(wcode==4001) {
      return "Rain";
    }
    else if(wcode==4200) {
      return "Light Rain";
    }
    else if(wcode==6201) {
      return "Heavy Freezing Rain";
    }
    else if(wcode==6001) {
      return "Freezing Rain";
    }
    else if(wcode==6200) {
      return "Light Freezing Rain";
    }
    else if(wcode==6000) {
      return "Freezing Drizzle";
    }
    else if(wcode==4000) {
      return "Drizzle";
    }
    else if(wcode==7101) {
      return "Heavy Ice Pellets";
    }
    else if(wcode==7000) {
      return "Ice Pellets";
    }
    else if(wcode==7102) {
      return "Light Ice Pellets";
    }
    else if(wcode==5101) {
      return "Heavy Snow";
    }
    else if(wcode==5000) {
      return "Snow";
    }
    else if(wcode==5100) {
      return "Light Snow";
    }
    else if(wcode==5001) {
      return "Flurries";
    }
    else if(wcode==8000) {
      return "Thunderstorm";
    }
    else if(wcode==2100) {
      return "Light Fog";
    }
    else if(wcode==2000) {
      return "Fog";
    }
    else if(wcode==1001) {
      return "Cloudy";
    }
    else if(wcode==1102) {
      return "Mostly Cloudy";
    }
    else if(wcode==1101) {
      return "Partly Cloudy";
    }
    else if(wcode==1100) {
      return "Mostly Clear";
    }
    else if(wcode==1000) {
      return "Clear";
    }
    else if(wcode==3000) {
      return "Light Wind";
    }
    else if(wcode==3001) {
      return "Wind";
    }
    else if(wcode==3002) {
      return "Strong Wind";
    }
    else
      return  "Clear";
  }

  ngOnInit(): void { }

}
