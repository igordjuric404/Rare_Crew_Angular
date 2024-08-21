import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface EmployeeEntry {
  EmployeeName: string;
  StarTimeUtc: string;
  EndTimeUtc: string;
  EntryNotes: string;
}

interface EmployeeData {
  name: string;
  totalTimeWorked: number;
  entryNotes: string[];
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl =
    'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<EmployeeData[]> {
    return this.http.get<EmployeeEntry[]>(this.apiUrl).pipe(
      map((data: EmployeeEntry[]) => {
        const employeeMap: { [key: string]: { totalTime: number; notes: string[] } } = {};

        data.forEach(entry => {
          const name = entry.EmployeeName || 'Unknown Employee'; // Default to 'Unknown Employee' if name is null
          const start = new Date(entry.StarTimeUtc).getTime();
          const end = new Date(entry.EndTimeUtc).getTime();
          const hoursWorked = (end - start) / (1000 * 60 * 60);

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

        return Object.keys(employeeMap)
          .map(name => ({
            name,
            totalTimeWorked: employeeMap[name].totalTime,
            entryNotes: employeeMap[name].notes,
          }))
          .sort((a, b) => b.totalTimeWorked - a.totalTimeWorked);
      })
    );
  }
}
