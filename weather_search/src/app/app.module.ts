import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
// import {HttpClientJsonpModule} from "@angular/common/http";

import { AppComponent } from './app.component';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';
import { HighchartsChartModule } from 'highcharts-angular';
import { AgmCoreModule } from '@agm/core';



// import {NgForm} from "@angular/forms";
// import { FormControl} from "@angular/forms";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    // HttpClientJsonpModule,
    ReactiveFormsModule,
    MatInputModule,
    // FormControl,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    HighchartsChartModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAp3S2F2HGiXRNsaLzYmDZjms5j3LiLsq0'
      // libraries: ['places']
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
