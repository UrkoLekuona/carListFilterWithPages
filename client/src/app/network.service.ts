import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  protocol = 'http://';
  webserver = 'localhost:8080';
  api = '';
  httpOptions: any = {
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    observe: 'body' as "body"
  };

  constructor(private http: HttpClient) { }

  getCarsBetweenDates(dates: { from?, to? }){
    let params = new HttpParams();
    if (dates.from) params.set("from", dates.from);
    if (dates.to) params.set("to", dates.to);
    return this.http.get(this.protocol + this.webserver + this.api + '/carsBetweenDates', { params: params });
  }
}
