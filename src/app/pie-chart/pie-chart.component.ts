import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { EmployeeService } from '../employee.service';

Chart.register(...registerables);

interface Employee {
  name: string;
  totalTimeWorked: number;
}

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  standalone: true,
  imports: [BaseChartDirective]
})
export class PieChartComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public pieChartType: 'pie' = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [], 
        backgroundColor: [] 
      }
    ]
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
            weight: 100
          },
          color: '#ffffff',
          padding: 15,
          boxWidth: 17,
        }
      }
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      }
    }
  };

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    // Fetch employee data and update the chart
    this.employeeService.getEmployees().subscribe((data: Employee[]) => {
      if (data.length === 0) return;

      const totalTimeWorked = data.reduce((acc, employee) => acc + employee.totalTimeWorked, 0);

      // Set chart labels with employee names and their work percentage
      this.pieChartData.labels = data.map(employee => {
        const percentage = ((employee.totalTimeWorked / totalTimeWorked) * 100).toFixed(1);
        return `${employee.name || 'Unknown'} (${percentage}%)`;
      });

      // Set chart data with percentages of total time worked
      this.pieChartData.datasets[0].data = data.map(employee => (employee.totalTimeWorked / totalTimeWorked) * 100);

      // Generate and set colors for the chart
      this.pieChartData.datasets[0].backgroundColor = this.generateColors(data.length);

      this.chart?.update();
    });
  }

  // Generate an array of colors based on the number of employees
  private generateColors(length: number): string[] {
    const baseColor = '#ffa500';
    const colors = Array.from({ length }, (_, i) => this.shadeColor(baseColor, i * (100 / length)));
    return colors;
  }

  // Adjust the shade of a color based on the percentage
  private shadeColor(color: string, percent: number): string {
    const R = parseInt(color.slice(1, 3), 16);
    const G = parseInt(color.slice(3, 5), 16);
    const B = parseInt(color.slice(5, 7), 16);

    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;

    const newR = Math.round((t - R) * p) + R;
    const newG = Math.round((t - G) * p) + G;
    const newB = Math.round((t - B) * p) + B;

    return `#${(newR < 16 ? "0" : "") + newR.toString(16)}${(newG < 16 ? "0" : "") + newG.toString(16)}${(newB < 16 ? "0" : "") + newB.toString(16)}`;
  }
}
