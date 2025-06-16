import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterLink } from '@angular/router';
import { ConsursoService } from '../../../servicios/concurso/concurso.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  images = [
    { src: 'https://picsum.photos/id/1011/300/200', alt: 'Imagen 1', cols: 1, rows: 1 },
    { src: 'https://picsum.photos/id/1015/300/200', alt: 'Imagen 2', cols: 1, rows: 2 },
    { src: 'https://picsum.photos/id/1016/300/200', alt: 'Imagen 3', cols: 1, rows: 1 },
  ];
  datosConcurso: any;
  fEnvioIni: any;
  fEnvioFin: any;
  fVotoIni: any;
  fVotoFin: any;
  fGanadores: any;

  constructor( private readonly concursoService: ConsursoService){}

  ngOnInit(): void {
    this.concursoService.getConcurso().subscribe(data => {
      this.datosConcurso = data;
      this.fEnvioIni = this.formatearFecha(this.datosConcurso.fechaInicioEnvio);
      this.fEnvioFin = this.formatearFecha(this.datosConcurso.fechaFinEnvio);
      this.fVotoIni = this.formatearFecha(this.datosConcurso.fechaInicioVotacion);
      this.fVotoFin = this.formatearFecha(this.datosConcurso.fechaFinVotacion);
      this.fGanadores = this.formatearFecha(this.datosConcurso.fechaAnuncio);
    });

  }

  formatearFecha(fecha: string): string {
    const [año, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${año}`;
  }
}
