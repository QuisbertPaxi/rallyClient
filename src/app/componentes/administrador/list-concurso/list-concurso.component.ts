import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiResponseConsurso } from '../../../modelos/api.response-concurso';
import { ConsursoService } from '../../../servicios/concurso/concurso.service';


@Component({
  selector: 'app-list-concurso',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './list-concurso.component.html',
  styleUrl: './list-concurso.component.scss'
})
export class ListConcursoComponent implements OnInit{

  private readonly _conscursoService = inject(ConsursoService)

  datosConcurso: ApiResponseConsurso = {};
  fEnvioIni: any;
  fEnvioFin: any;
  fVotoIni: any;
  fVotoFin: any;
  fGanadores: any;
  nfotografias: any;


  ngOnInit(): void {
    this._conscursoService.getConcurso().subscribe({
      next: (data) => {
        this.datosConcurso = data;
        this.fEnvioIni = this.formatearFecha(this.datosConcurso.fechaInicioEnvio);
        this.fEnvioFin = this.formatearFecha(this.datosConcurso.fechaFinEnvio);
        this.fVotoIni = this.formatearFecha(this.datosConcurso.fechaInicioVotacion);
        this.fVotoFin = this.formatearFecha(this.datosConcurso.fechaFinVotacion);
        this.fGanadores = this.formatearFecha(this.datosConcurso.fechaAnuncio);
        this.nfotografias = this.datosConcurso.numeroFotografias
      },
      error: (err) => {
        console.error("Error al obtener el concurso:", err);
      }
    });
  }

  formatearFecha(fecha: any): string {
    const [año, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${año}`;
  }
}
