import { Component, ViewChild } from '@angular/core';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Rare_Crew_Angular';
  sortAscending: boolean = false;

  @ViewChild('employeeTable') employeeTable!: EmployeeTableComponent;
  @ViewChild('pieChart') pieChart!: PieChartComponent;

  sortAll(): void {
    this.sortAscending = !this.sortAscending;
    this.employeeTable.sortAscending = this.sortAscending;
    this.pieChart.sortAscending = this.sortAscending;
    this.employeeTable.fetchEmployees();
    this.pieChart.fetchEmployees();
  }
}
