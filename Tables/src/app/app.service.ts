import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { APIResult, ApplicatorObject, DataTableObject,  } from './table/table.model';
import { map, Observable } from 'rxjs';
import { DataTableFilter } from './mat-table/mat-table.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _http_header: HttpHeaders = new HttpHeaders({
    accept: 'application/json',
    // Authorization: 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJNZW1iZXJJZCI6IjQxIiwiRW1wbG95ZWVUeXBlSWQiOiIyIiwiRmlyc3ROYW1lIjoiRWxpc2EiLCJMYXN0TmFtZSI6Ik1vbHRlbmkiLCJFbWFpbCI6InZsYXRrb0BtYWlsLmNvbSIsIkJyYW5jaElkIjoiMSIsIk1lbWJlckd1aWQiOiI1YzEyOGFiYy0zZTg2LTRhYmUtYTI1OC0xZWM5Y2Y1YTJjZjQiLCJleHAiOjE2NjI3OTM2Njh9.i7vbEz1R6JqKS7mkylTFG-xZYwLCQgg6FysODnukAEM',
  });

  constructor(private _httpClient: HttpClient,) { }


  getApplicatorsList(filter: DataTableFilter):  Observable<any> {
    return this._httpClient.post<any>(`http://api.interns.techup.me/user/datatable`, filter);
  }


}
