import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

interface EmployeeEntry {
  EmployeeName: string;
  StarTimeUtc: string;
  EndTimeUtc: string;
  EntryNotes: string;
}

interface Employee {
  name: string;
  totalTimeWorked: number;
  entryNotes: string[];
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Fetches employee entries from the API
  getEmployees(): Observable<EmployeeEntry[]> {
    return this.http.get<EmployeeEntry[]>(this.apiUrl);
  }

  // Transforms raw employee entries into a structured employee list
  transformEntriesToEmployees(entries: EmployeeEntry[]): Employee[] {
    const employeeMap: { [key: string]: { totalTime: number; notes: string[] } } = {};

    // Process each entry to calculate total time worked and accumulate notes
    entries.forEach((entry) => {
      const name = entry.EmployeeName || 'Unknown Employee';
      const start = new Date(entry.StarTimeUtc).getTime();
      const end = new Date(entry.EndTimeUtc).getTime();
      const hoursWorked = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours

      if (employeeMap[name]) {
        employeeMap[name].totalTime += hoursWorked;
        employeeMap[name].notes.push(entry.EntryNotes || 'No Notes Provided');
      } else {
        employeeMap[name] = {
          totalTime: hoursWorked,
          notes: [entry.EntryNotes || 'No Notes Provided'],
        };
      }
    });

    // Convert the employee map into an array of Employee objects
    return Object.keys(employeeMap).map((name) => ({
      name,
      totalTimeWorked: employeeMap[name].totalTime,
      entryNotes: employeeMap[name].notes,
    }));
  }

  // Fetches and sorts employees based on the sort order (ascending or descending)
  getSortedEmployees(sortAscending: boolean): Observable<Employee[]> {
    return this.getEmployees().pipe(
      map((entries: EmployeeEntry[]) => { // Specify the type for 'entries'
        const employees = this.transformEntriesToEmployees(entries);
        return employees.sort((a, b) =>
          sortAscending ? a.totalTimeWorked - b.totalTimeWorked : b.totalTimeWorked - a.totalTimeWorked
        );
      })
    );
  }
}
