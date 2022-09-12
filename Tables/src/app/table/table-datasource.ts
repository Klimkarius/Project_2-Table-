import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { finalize, map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';
import { ApplicatorObject, DataTableFilter, DataTableObject } from './table.model';
import { AppService } from '../app.service';

export class TableDataSource extends DataSource<ApplicatorObject> {

  /**
   * Private variables
   */
   private loadingSubject = new BehaviorSubject<boolean>(false);
   private totalApplicatorsCountSubject = new BehaviorSubject<number>(0);

  /**
   * Public variables
   */
  public applicatorsSubject = new BehaviorSubject<ApplicatorObject[]>([]);
  public loading$ = this.loadingSubject.asObservable();
  public totalApplicatorsCount$ = this.totalApplicatorsCountSubject.asObservable();
  public show_table: boolean = false;
  public show_no_applicators: boolean = false;

  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  // -----------------------------------------------------------------------------------------------------
  // @ Constructor
  // -----------------------------------------------------------------------------------------------------
  constructor(private _appService: AppService) {
    super();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to load jobs
   */
  loadApplicators(filter: DataTableFilter) {
    this.loadingSubject.next(true);
    this._appService.getApplicatorsList(filter).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(
      (response: DataTableObject<ApplicatorObject[]>) => {
        if(response) {
          this.totalApplicatorsCountSubject.next(response.totalRecords);
          this.applicatorsSubject.next(response.data);
          if(response.data.length > 0) {
            this.show_table = true;
            this.show_no_applicators = false;
          }
          else {
            this.show_table = false;
            this.show_no_applicators = true;
          }
        }
      }
    )
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ApplicatorObject[]> {
    return this.applicatorsSubject.asObservable();
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    this.applicatorsSubject.complete();
    this.totalApplicatorsCountSubject.complete();
    this.loadingSubject.complete();
  }
}