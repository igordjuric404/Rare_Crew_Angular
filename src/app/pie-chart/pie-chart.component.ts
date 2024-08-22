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
    this.employeeService.getEmployees().subscribe((data: Employee[]) => {
      if (data.length === 0) return;

      const totalTimeWorked = data.reduce((acc, employee) => acc + employee.totalTimeWorked, 0);

      this.pieChartData.labels = data.map(employee => {
        const percentage = ((employee.totalTimeWorked / totalTimeWorked) * 100).toFixed(1);
        return `${employee.name || 'Unknown'} (${percentage}%)`;
      });

      this.pieChartData.datasets[0].data = data.map(employee => (employee.totalTimeWorked / totalTimeWorked) * 100);

      this.pieChartData.datasets[0].backgroundColor = this.generateColors(data.length);

      this.chart?.update();
    });
  }

  private generateColors(length: number): string[] {
    const colors = [];
    const baseColors = ['#ffda99', '#ffd487', '#ffcd75', '#ffc763', '#ffc152', '#ffba40', '#ffb42e', '#ffad1c', '#ffa70a', '#ffa300', '#ffa500'];

    for (let i = 0; i < length; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }

    return colors;
  }
}
