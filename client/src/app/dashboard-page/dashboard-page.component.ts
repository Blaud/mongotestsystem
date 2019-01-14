import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  @ViewChild('client_id') client_idRef: ElementRef;

  @ViewChild('startDate') startDateRef: ElementRef;
  @ViewChild('endDate') endDateRef: ElementRef;

  @ViewChild('messages_count') messages_countRef: ElementRef;
  @ViewChild('start_user_id') start_user_idRef: ElementRef;
  @ViewChild('end_user_id') end_user_idRef: ElementRef;
  @ViewChild('days_back') days_backRef: ElementRef;

  public graph = {
    data: [
        { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'green'}, name: 'delivered' },
        { x: [1, 2, 3], y: [7, 4, 5], type: 'scatter', mode: 'lines+points', marker: {color: 'red'}, name: 'failed' }
    ],
    layout: {width: 800, height: 600, title: 'Statistics: Day / Messages count'}
};

  messages$: Observable<any>;
  messages: any[];
  dates: any[] = [];
  counts: any[] = [];
  dbDropStatus: String = '';
  messageCreateStatus: String = '';


  constructor(private http: HttpClient) { }

  ngOnInit() {
    console.log('hi');
  }

  getButtonClicked(event: Event) {
    if (this.client_idRef.nativeElement.value && this.startDateRef.nativeElement.value && this.endDateRef.nativeElement.value) {
      this.http.get<any>(
        `/api/message/countsPerDay/${
          this.client_idRef.nativeElement.value
        }/${
          new Date(this.startDateRef.nativeElement.value).toISOString()
        }/${
          new Date(this.endDateRef.nativeElement.value).toISOString()
        }`).subscribe(
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

  dropDB(event: Event) {
    this.http.get<any>(`/api/message/dropAll`).subscribe(
      response => {
        this.dbDropStatus = response.message;
        setTimeout(() => {this.dbDropStatus = ''; }, 2000);
      },
      error => {
        console.log(error);
      }
    );
  }
  createMessages(event: Event) {
    if (this.messages_countRef.nativeElement.value &&
       this.start_user_idRef.nativeElement.value && this.end_user_idRef.nativeElement.value && this.days_backRef.nativeElement.value) {

        this.http.get<any>(
          `/api/message/create/${
            this.messages_countRef.nativeElement.value
          }/${
            this.start_user_idRef.nativeElement.value
          }/${
            this.end_user_idRef.nativeElement.value
          }/${
            this.days_backRef.nativeElement.value
          }`).subscribe(
          response => {
            this.messageCreateStatus = response.message;
            setTimeout(() => {this.messageCreateStatus = ''; }, 4000);
          },
          error => {
            console.log(error);
          }
        );

    }
  }

  convertData(data: any[]) {
    this.dates = [[], []];
    this.counts = [[], []];
    data[0].sort((a, b) => a.timestamp - b.timestamp);
    data[1].sort((a, b) => a.timestamp - b.timestamp);
    data[0].forEach(element => {
      this.dates[0].push(element.timestamp);
      this.counts[0].push(element.count);
    });

    data[1].forEach(element => {
      this.dates[1].push(element.timestamp);
      this.counts[1].push(element.count);
    });

    this.graph.data[0].x = this.dates[0];
    this.graph.data[0].y = this.counts[0];

    this.graph.data[1].x = this.dates[1];
    this.graph.data[1].y = this.counts[1];
  }
}
