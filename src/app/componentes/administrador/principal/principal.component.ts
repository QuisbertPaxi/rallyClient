import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FotografiaService } from '../../../servicios/fotografia/fotografia.service';
import { ApiResponseFotografia } from '../../../modelos/api-response-fotografia';
import { UsuarioService } from '../../../servicios/usuario.service';
import { User } from '../../../modelos/user';
import { AlertService } from '../../../servicios/alert.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [MatCardModule,
            MatFormFieldModule,
            MatSelectModule,
            MatInputModule,
            FormsModule,
            ReactiveFormsModule,
            CommonModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss'
})
export class PrincipalComponent implements OnInit{
  estados = ['APROBAR', 'RECHAZAR'];
  adminDatos: User = {};

  fotografias: ApiResponseFotografia [] = [];

  private readonly _fotografiaService = inject(FotografiaService)
  private readonly _usuarioService = inject(UsuarioService)
  private readonly _alertService = inject(AlertService);

  ngOnInit(): void {
    this._usuarioService.getUserData().subscribe({
          next: (us: User) => {
            this.adminDatos = us;

            this._fotografiaService.getFotografiaEstado(this.adminDatos.id!, "PENDIENTE").subscribe({
              next: data => {
                this.fotografias = data;
              },
              error: err => {
                console.error('Error al obtener las fotografías:', err);
                alert('No se pudo obtener las fotografías.');
              }
            });
          },
          error: err => {
            console.error('Error al obtener participante:', err);
            alert('No se pudo obtener el participante.');
          }
        });
  }

  /* seleccionarEstado(foto: any, nuevoEstado: string) {
    const estadoAnterior = foto.estado;

    this._alertService
      .confirmBox("Cambiar Estado", `¿Está seguro de ${nuevoEstado} la fotografia "${foto.titulo}"?`)
      .then((result) => {
        if (result.value) {
          const aprobado = nuevoEstado === 'APROBAR';
          foto.estado = nuevoEstado;

          this._fotografiaService.aprobarFotografia(foto.id, this.adminDatos.id!, aprobado).subscribe({
            next: (resp) => {
              this._alertService.alertWithSuccess(`Usted acaba de ${nuevoEstado} la fotografia "${foto.titulo}"`);
            },
            error: (err) => this._alertService.alertWithError(`Hubo un error al ${nuevoEstado} la fotografia "${foto.titulo}"`)
          });

          this.ngOnInit();
        } else {
          foto.estado = estadoAnterior;
        }
    });
  } */
  seleccionarEstado(foto: ApiResponseFotografia, nuevoEstado: string) {
   
    const esAprobacion = nuevoEstado === 'APROBAR';

    this._alertService
      .confirmBox("Cambiar Estado", `¿Está seguro de ${esAprobacion ? 'APROBAR' : 'RECHAZAR'} la fotografía "${foto.titulo}"?`)
      .then((result) => {
        if (result.value) { 
          
          this._fotografiaService.aprobarFotografia(foto.id!, this.adminDatos.id!, esAprobacion).subscribe({
            next: (resp: any) => { 
              if (esAprobacion) {
                this._alertService.alertWithSuccess(`Usted acaba de APROBAR la fotografía "${foto.titulo}"`);
              } else {
                this._alertService.alertWithSuccess(`Usted acaba de RECHAZAR y eliminar la fotografía "${foto.titulo}"`);
              }

              this.ngOnInit();
            
            },
            error: (err) => {
              this._alertService.alertWithError(`Hubo un error al ${esAprobacion ? 'APROBAR' : 'RECHAZAR'} la fotografía "${foto.titulo}".`);
              console.error('Error en la operación:', err);
            }
          });
        }
    });
  }

}
