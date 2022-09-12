
import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { debounceTime, merge, Subject, takeUntil, tap } from 'rxjs';
import { AppService } from '../app.service';
import { TableDataSource } from './table-datasource';
import { ApplicatorObject, DataTableFilter } from './table.model';

@Component({
  selector: 'table-app',
  styleUrls: ['./table.component.scss'],
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ApplicatorObject>;
  dataSource: TableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [ 'applicator', 'jobTitle', 'isVerified', 'status', 'options' ];

  /**
   * Public variables
   */
  filter: DataTableFilter = new DataTableFilter();
  show_spinner: boolean = false;
  show_sidebar: boolean = false;
  show_action_menu: boolean = false;
  applicatorDetailsObject: ApplicatorObject = new ApplicatorObject();
  searchControl: FormControl = new FormControl();

  /**
   * Private variables
   */
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  // -----------------------------------------------------------------------------------------------------
  // @ Constructor
  // -----------------------------------------------------------------------------------------------------
  constructor(
    private _appService: AppService,
    private _cdRef: ChangeDetectorRef) { }


  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._subscribeToDataSource();
    this.applySearchFilter();
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(takeUntil(this._unsubscribeAll),
        tap(() => this._getApplicators(true))
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

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function for Subscribing to Data Source File
   */
   private _subscribeToDataSource(){
    this.dataSource = new TableDataSource(this._appService);
    this.dataSource.loading$.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: boolean) => this.show_spinner = data);
    this._getApplicators(false);
  }

  /**
   * Function for calling API when filter is changed
   */
  private _getApplicators(isChange: boolean) {
    if(isChange) {
      this.filter.pageNumber = this.paginator.pageIndex + 1;
      this.filter.pageSize = this.paginator.pageSize;
      this.filter.sortColumn = this.sort.active;
      this.filter.sortDirection = this.sort.direction;
    }
    else {
      this.filter.pageSize = 10;
      this.filter.pageNumber = 1;
      this.filter.sortColumn = "status";
      this.filter.sortDirection = "desc";
    }

    this.dataSource.loadApplicators(this.filter);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function for Searching applicators
   */
  applySearchFilter() {
    this.searchControl.valueChanges.pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe({
      next: (data: string) => {

        this.filter.search = data;
        this.dataSource.loadApplicators(this.filter);
      }
    })
  }
}
