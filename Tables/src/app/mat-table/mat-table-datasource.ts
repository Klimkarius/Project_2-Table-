import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf, merge, BehaviorSubject, connect, filter } from 'rxjs';
import { ApplicatorObject, DataTableFilter, UserData } from './mat-table.model';
import { AppService } from '../app.service';
import { finalize } from 'rxjs';
import { DataTableObject } from './mat-table.model';

export class MattTableDataSource extends DataSource<UserData> {

/**
   * Private variables
   */
 private totalApplicatorsCountSubject = new BehaviorSubject<number>(0);

/**
 * Public variables
 */
public applicatorsSubject = new BehaviorSubject<UserData[]>([]);
public totalApplicatorsCount$ = this.totalApplicatorsCountSubject.asObservable();

paginator: MatPaginator | undefined;
sort: MatSort | undefined;

// -----------------------------------------------------------------------------------------------------
// @ Constructor
// -----------------------------------------------------------------------------------------------------
constructor(private _appService: AppService) {
  super();
}


/**
 * Function to load jobs
 */
loadTableData(filter: DataTableFilter) {
  debugger
  // 1. Make POST API Request to get table data, pass 'filter' as input parameter ( use the constructor to import some service )
  // 2. Subscribed API data pass to the following subjects:
  // - applicatorsSubject ( applicants array )
  // - totalApplicatorsCountSubject ( total applicants )
  // this.totalApplicatorsCountSubject.next(0);
  //   this._appService.getApplicatorsList(filter).pipe(
  //     finalize(() => this.totalApplicatorsCountSubject.next(0))
  //     ).subscribe(
  //     (response: any) => {
  //       debugger;
  //       if(response) {
  //         this.totalApplicatorsCountSubject.next(response.totalRecords);
  //         this.applicatorsSubject.next(response.data);
  //         // if(response.data.length > 0) {
          
  //         // }
  //         // else {
         
  //         // }
  //       }
  //     }
  //   )
    this._appService.getApplicatorsList(filter).subscribe(
      (response: DataTableObject<UserData[]>) => {
        if (response) {
          this.totalApplicatorsCountSubject.next(response.totalRecords);
          this.applicatorsSubject.next(response.items);
        }
      }
    )
}


/////  --- Default DataSource Functions ---   /////

/**
 * Connect this data source to the table. The table will only update when
 * the returned stream emits new items.
 * @returns A stream of the items to be rendered.
 */
connect(): Observable<UserData[]> {
  return this.applicatorsSubject.asObservable();
}

/**
 *  Called when the table is being destroyed. Use this function, to clean up
 * any open connections or free any held resources that were set up during connect.
 */
disconnect(): void {
  this.applicatorsSubject.complete();
  this.totalApplicatorsCountSubject.complete();
}

}