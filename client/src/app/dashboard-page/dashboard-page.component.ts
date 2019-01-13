import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { resolve } from 'q';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  @ViewChild('client_id') client_idRef: ElementRef;

  public graph = {
    data: [
        { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
        { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
    ],
    layout: {width: 800, height: 600, title: 'A Fancy Plot'}
};

  messages$: Observable<any>;
  messages: any[];
  dates: any[] = [];
  counts: any[] = [];


  constructor(private http: HttpClient) { }

  ngOnInit() {
    console.log('hi');
  }

  getButtonClicked(event: Event) {
    if (this.client_idRef.nativeElement.value) {
      this.http.get<any>(`/api/message/countsperday/${this.client_idRef.nativeElement.value}`).subscribe(
        response => {
          this.messages = response;
          this.convertData(response);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.http.get<any>(`/api/message/countsperday`).subscribe(
        response => {
          this.messages = response;
          this.convertData(response);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  convertData(data: any[]) {
    this.dates = [];
    this.counts = [];
    data.forEach(element => {
      this.dates.push((new Date(element.timestamp)).getUTCDate());
      this.counts.push(element.count);
    });
    this.graph.data[0].x = this.dates;
    this.graph.data[0].y = this.counts;

    this.graph.data[1].x = this.dates;
    this.graph.data[1].y = this.counts;

    console.log(this.graph.data[0].y);
  }
}
