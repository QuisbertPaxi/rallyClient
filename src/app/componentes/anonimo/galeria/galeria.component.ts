import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FotografiaService } from '../../../servicios/fotografia/fotografia.service';
import { ApiResponseFotografia } from '../../../modelos/api-response-fotografia';
import { AlertService } from '../../../servicios/alert.service';
import { VotoService, VotoDTO } from '../../../servicios/voto/voto.service';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss']
})
export class GaleriaComponent {
  fotografias: ApiResponseFotografia [] = [];
  yaVoto = true;
  ip: string = '';
  private readonly _fotografiaService = inject(FotografiaService);
  private readonly _votoService = inject(VotoService);
  private readonly _alertService = inject(AlertService);
  private readonly _http = inject(HttpClient);

  constructor(){
    this.yaVoto = localStorage.getItem(`voto`) === 'true';
  }

  ngOnInit(): void {
    this.obtenerIp();
    this.cargarFotografias();
  }

  votar(imagen: any) {
    this.yaVoto = localStorage.getItem(`voto`) === 'true';
    if(!this.yaVoto){
      this._alertService
      .confirmBox("Votar", `Esta seguro de votar por la fotografía: ${imagen.titulo}?`)
      .then((result) => {
        if (result.value) {
          const voto: VotoDTO = {
            ip: this.ip,
            idFotografia: imagen.id
          };
          this._votoService.postVotar(voto).subscribe({
            next: (response) => {
              this._alertService.alertWithSuccess("Se registró su voto. ¡Gracias por participar!");
              this.cargarFotografias();
              localStorage.setItem(`voto`, 'true');
              this.yaVoto = true;
            },
            error: (err) => {
              if (err.status === 409) {
                console.warn('Usted ya emitió su voto anteriormente (desde el back IP)');
                this._alertService.alertWithError("No se registró su voto. Usted ya emitió su voto anteriormente");
              } else {
                console.error('Error al votar', err);
              }
            }
          });
        }
      });
    }else{
      console.warn('Usted ya emitió su voto anteriormente (desde localstorage)');
      this._alertService.alertWithError("No se registró su voto. Usted ya emitió su voto anteriormente");
    }

  }

  cargarFotografias(){
    this._fotografiaService.getAllFotografia().subscribe(
      (response) =>
        {
          if (response != null) {
              this.fotografias = response;
          }
        });
  }

  obtenerIp() {
    this._http.get('https://api.ipify.org?format=json').subscribe((res: any) => {
      this.ip = res.ip;
    });
  }
}
