import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FotografiaService } from '../../../servicios/fotografia/fotografia.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss'
})
export class EstadisticasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | null = null;
  fotografias: any[] = [];
  ganador: any = null;
  intervalId: any;

  constructor(private readonly fotografiaService: FotografiaService) {}

  ngOnInit(): void {
    this.cargarFotografias();

    // ⏱ Ejecuta cada 10 segundos
    this.intervalId = setInterval(() => {
      this.cargarFotografias();
    }, 10000);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  cargarFotografias(): void {
    this.fotografiaService.getAllFotografia().subscribe((response: any[]) => {
      if (response != null) {
        this.fotografias = response
          .sort((a, b) => b.cantidadVotos - a.cantidadVotos)
          .slice(0, 10);

        this.ganador = this.obtenerGanador();
        this.updateChart(); // usa updateChart en vez de createChart
      }
    });
  }

  updateChart(): void {
    const labels = this.fotografias.map(f => f.titulo);
    const data = this.fotografias.map(f => f.cantidadVotos);

    if (this.chart) {
      // Actualiza datos si el gráfico ya existe
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    } else {
      // Si no existe, crea el gráfico
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Cantidad de Votos',
              data: data,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  precision: 0
                }
              }
            }
          }
        });
      }
    }
  }

  obtenerGanador() {
    return this.fotografias.length > 0 ? this.fotografias[0] : null;
  }
}
