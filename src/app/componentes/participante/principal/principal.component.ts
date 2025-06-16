import { ApiResponseFotografia } from '../../../modelos/api-response-fotografia';
import { FotografiaService } from '../../../servicios/fotografia/fotografia.service';
import { User } from '../../../modelos/user';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../servicios/usuario.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../servicios/alert.service';


@Component({
  selector: 'app-principal-consu',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],

  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalPComponent implements OnInit{
  participanteDatos: User = {} as User;
  fotografias: ApiResponseFotografia [] = [];
  private readonly _usuarioService = inject(UsuarioService)
  private readonly _fotografiaService = inject(FotografiaService)
  private readonly _alertService = inject(AlertService);

  constructor(private readonly router: Router){}

  ngOnInit(): void {
    this._usuarioService.getUserData().subscribe({
      next: (us: User) => {
        this.participanteDatos = us;

        this._fotografiaService.getFotografiaParticipante(this.participanteDatos.id!).subscribe({
          next: data => {
            this.fotografias = data.filter((f:ApiResponseFotografia) => f.estado !== 'ELIMINADO');
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

  editarFotografia(foto:ApiResponseFotografia){
    this.router.navigate(['/participante/addFotografia/',foto.id]);
  }

  eliminarFoto(foto: ApiResponseFotografia) {
    this._alertService
    .confirmDeleteBox(foto.titulo)
    .then((result) => {
      if (result.value) {
        this._fotografiaService.deleteFotografia(foto.id!, this.participanteDatos.userName!).subscribe({
          next: () => {
            this.fotografias = this.fotografias.filter(f => f.id !== foto.id);
            this._alertService.alertWithSuccess(`Se ha eliminado la fotografía ${foto.titulo}`);
          },
          error: err => {
            console.error('Error al eliminar la foto:', err);
            this._alertService.alertWithError("Ocurrió un error al eliminar la fotografía. Inténtelo más tarde");
          }
        });
      }
    });
  }

  irAddFotografia(){
    this.router.navigate(["/participante/addFotografia"]);
  }
}
