import { Component, OnInit, ViewChild } from '@angular/core';

import {
  MatTableDataSource,
  MatPaginator,
  MatSort
} from "@angular/material";
import * as moment from 'moment';

import { NetworkService } from "./network.service";

export interface Car {
  plateNumber: string;
  registrationDate: string;
  brand: string;
  color: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  displayedColumns: string[] = ['plateNumber', 'registrationDate', 'brand', 'color'];
  dataSource: MatTableDataSource<Car>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private network: NetworkService) {}

  ngOnInit() {
    this.network.getCarsBetweenDates({}).subscribe(data => {
      var aux: any = data;
      aux.forEach(car => {
        car.registrationDate = moment(car.registrationDate, "YYYY-MM-DDTHH:mm:ss.SSSZ", true)
      });
      this.dataSource = new MatTableDataSource<Car>(aux);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      console.log(error);
      switch (error.status) {
        case 400: {
          break;
        }

        case 500: {
          break;
        }

        default: {
          console.log('Unknown error');        }
      }
    });
  }
}
