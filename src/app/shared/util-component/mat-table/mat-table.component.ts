import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatRow } from '../../model/Mat.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss']
})
export class MatTableComponent implements OnInit, OnChanges {

  @Input()
  filterDisplay: number = 0;

  @Input()
  matRows: MatRow[] = [];

  @Input()
  pagination: number[] = [5, 10, 25, 100];

  @Input()
  displayFilter: boolean = false;

  @Input()
  displayPagination: boolean = false;

  @Output()
  onEditRow: EventEmitter<MatRow> = new EventEmitter();

  displayedColumns: string[] = [];
  
  dataSource = new MatTableDataSource(this.matRows);

  filter?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges() {
    this.init();
  }

  init() {
    this.displayedColumns = [];
    if(this.matRows.length > 0) {
      for (const [key, value] of Object.entries(this.matRows[0])) {
        this.displayedColumns.push(key.toString())
      }
      this.pagination = this.pagination.sort((a, b) => a - b);
      this.dataSource.data = this.matRows;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  getValue(element: any, key: any): any {
    for (const [keyT, value] of Object.entries(element)) {
      if(keyT === key)
        return value;
    }

    return "";
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter() {
    this.dataSource.filter = '';

    if (this.dataSource.paginator) 
    {
      this.dataSource.paginator.firstPage();
    }
  }

  editRow(row: MatRow) {
    this.onEditRow.emit(row);
  }
}
