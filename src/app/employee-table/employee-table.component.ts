import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Observable } from 'rxjs';

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
  // Observable that will hold the list of employees
  employees$!: Observable<Employee[]>;

  // Inject the EmployeeService to fetch employee data
  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employees$ = this.employeeService.getEmployees();
  }

  // trackBy function to optimize the rendering of the employee list
  trackByEmployee(index: number, employee: Employee): string {
    return employee.name; // Use the employee's name as a unique identifier
  }
}
