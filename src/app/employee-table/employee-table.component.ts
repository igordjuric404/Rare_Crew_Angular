import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';

interface Employee {
  name: string;
  totalTimeWorked: number;
  entryNotes: string[];
}

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css'],
})
export class EmployeeTableComponent implements OnInit {
  employees: Employee[] = [];
  sortAscending: boolean = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    // Sorts employees by total time worked, either ascending or descending based on sortAscending
    this.employeeService.getSortedEmployees(this.sortAscending).subscribe((employees) => {
      this.employees = employees;
    });
  }

  trackByEmployee(index: number, employee: Employee): string {
    // Uniquely identify and track each employee based on employee's name, which helps to re-render table without re-rendering unchanged items.
    return employee.name;
  }
}
