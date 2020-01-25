import { Component, OnInit, ViewChild } from '@angular/core';

import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  ValidatorFn,
  AbstractControl
} from "@angular/forms";

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

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const error = !moment(control.value, "YYYY/MM/DD", true).isValid() && control.value != null && control.value != '';
    return error ? {'invalidDate': {value: control.value}} : null;
  };
}

export function dateOrderValidator(from: AbstractControl, to: AbstractControl): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const error = moment(from.value, "YYYY/MM/DD", true).isAfter(moment(to.value, "YYYY/MM/DD"));
    return error ? {'invalidDateOrder': "'To' must be greater than 'From'"} : null;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['plateNumber', 'registrationDate', 'brand', 'color'];
  dataSource: MatTableDataSource<Car>;
  datesForm: FormGroup;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private formBuilder: FormBuilder, private network: NetworkService) { }

  ngOnInit() {
    this.datesForm = this.formBuilder.group({
      from: new FormControl("", dateValidator()),
      to: new FormControl("", dateValidator())
    });
    this.datesForm.setValidators(dateOrderValidator(this.datesForm.get('from'), this.datesForm.get('to')));
    this.getCars(null, null);
  }

  filter() {
    let from = this.datesForm.get('from').value;
    let to = this.datesForm.get('to').value;
    if (!from || (typeof from !== 'string' && !from.isValid())) {
      from = null;
    }
    if (!to || (typeof to !== 'string' && !to.isValid())) {
      to = null;
    }
    this.getCars(from, to);
  }

  getCars(from, to) {
    let params: { from?, to?} = {};
    if (from) params.from = from.format("YYYY/MM/DD");
    if (to) params.to = to.format("YYYY/MM/DD");
    this.network.getCarsBetweenDates(params).subscribe(data => {
      var aux: any = data;
      aux.forEach(car => {
        car.registrationDate = moment(car.registrationDate, "YYYY-MM-DDTHH:mm:ss.SSSZ", true)
      });
      this.dataSource = new MatTableDataSource<Car>(aux);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      console.log(error);
      alert(error.statusText);
      /*switch (error.status) {
        case 400: {
          alert(error.error.status);
          break;
        }

        case 500: {
          alert(error.error.status);
          break;
        }

        default: {
          alert(error.statusText);
        }
      }
      */
    });
  }
}
