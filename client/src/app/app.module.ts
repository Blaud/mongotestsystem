import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { UserstatisticService } from './userstatistic.service';
import { PlotlyModule } from 'angular-plotly.js';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatNativeDateModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PlotlyModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    UserstatisticService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
