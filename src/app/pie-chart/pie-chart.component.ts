import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { EmployeeService } from '../employee.service';
import { map } from 'rxjs/operators';

Chart.register(...registerables);

interface SimplifiedEmployee {
  name: string;
  totalTimeWorked: number;
}

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public pieChartType: 'pie' = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  };

  public chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'left',
        align: 'center',
        labels: {
          font: {
            family: 'sans-serif',
            size: 17,
            weight: 100,
          },
          color: '#ffffff',
          padding: 15,
          boxWidth: 17,
        },
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    },
  };

  employees: SimplifiedEmployee[] = [];
  sortAscending: boolean = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    // Sort employees by total time worked, either ascending or descending
    this.employeeService.getSortedEmployees(this.sortAscending).subscribe((employees) => {
      this.employees = employees;
      this.updateChart();
    });
  }

  updateChart(): void {
    const totalTimeWorked = this.employees.reduce(
      (acc, employee) => acc + employee.totalTimeWorked, 0
    );

      // Update chart labels and data with employee names and percentages
      this.pieChartData.labels = this.employees.map((employee) => {
      const percentage = (
        (employee.totalTimeWorked / totalTimeWorked) *
        100
      ).toFixed(1);
      return `${employee.name || 'Unknown'} (${percentage}%)`;
    });

    // Map the total time worked for each employee to a percentage of the total time
    this.pieChartData.datasets[0].data = this.employees.map(
      (employee) => (employee.totalTimeWorked / totalTimeWorked) * 100
    );

    // Generate colors for each slice of the pie chart based on the number of employees
    this.pieChartData.datasets[0].backgroundColor = this.generateColors(
      this.employees.length
    );

    this.chart?.update();
  }

  private generateColors(length: number): string[] {
    const baseColors = [
      '#ffda99', '#ffd487', '#ffcd75', '#ffc763', '#ffc152',
      '#ffba40', '#ffb42e', '#ffad1c', '#ffa70a', '#ffa300', '#ffa500',
    ];

    // Generate a list of colors, cycling through baseColors if necessary
    return Array.from({ length }, (_, i) => baseColors[i % baseColors.length]);
  }
}
