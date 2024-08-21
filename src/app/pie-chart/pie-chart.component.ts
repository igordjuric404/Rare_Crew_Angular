import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartType, ChartData, ChartOptions, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { EmployeeService } from '../employee.service';

Chart.register(...registerables);

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
            size: 18,
          },
          color: '#ffffff',
          padding: 15, 
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
    this.employeeService.getEmployees().subscribe((data: any) => {
      const totalTimeWorked = data.reduce((acc: number, employee: any) => acc + employee.totalTimeWorked, 0);

      this.pieChartData.labels = data.map((employee: any) => employee.name || 'Unknown');
      this.pieChartData.datasets[0].data = data.map((employee: any) => {
        return (employee.totalTimeWorked / totalTimeWorked) * 100;
      });

      const colors = [
        '#ffda99', '#ffd487', '#ffcd75', '#ffc763', '#ffc152',
        '#ffba40', '#ffb42e', '#ffad1c', '#ffa70a', '#ffa300', '#ffa500'
      ];

      this.pieChartData.datasets[0].backgroundColor = colors;

      this.chart?.update(); 
    });
  }
}
