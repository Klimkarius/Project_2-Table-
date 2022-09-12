import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subject, takeUntil, tap } from 'rxjs';
import { AppService } from '../app.service';
import { MattTableDataSource } from './mat-table-datasource';
import { DataTableFilter, UserData } from './mat-table.model';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss']
})
export class MatTableComponent implements AfterViewInit  {

  displayedColumns: string[] = ['first_name', 'last_name', 'email', 'city', 'country'];
  dataSource: MattTableDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  // Check if the filter object 'DataTableFilter' is same on Swagger
  filter: DataTableFilter = new DataTableFilter();

  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private _appService: AppService,
  ) {
    this._subscribeToDataSource();
  }

  /**
 * Function for Subscribing to Data Source File
 */
  _subscribeToDataSource(){
    this.dataSource = new MattTableDataSource(this._appService);
    this.getData();
  }

  // Get Table Data
  getData() {
    this.filter.pageNumber = this.paginator ? this.paginator.pageIndex + 1 : 1;
    this.filter.pageSize = this.paginator ? this.paginator.pageSize : 10;
    this.filter.sortColumn = this.sort ? this.sort.active : null;
    this.filter.sortDirection = this.sort ? this.sort.direction : 'asc';

    // Call 'loadTableData' inside DataSource file, pass filter as input parameter
    this.dataSource.loadTableData(this.filter);
  }

  // Search Table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter.search = filterValue;

    // Call 'loadTableData' inside DataSource file, pass filter as input parameter
    this.dataSource.loadTableData(this.filter);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(takeUntil(this._unsubscribeAll),
        tap(() => {
          this.getData();
        })
      )
      .subscribe();
  }

  /**
   * On destroy
   */
     ngOnDestroy(): void {
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
    }

}
