import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../modelos/user';
import { UsuarioService } from '../../../servicios/usuario.service';
import { TokenService } from '../../../servicios/jwt/token.service';
import { RolService } from '../../../servicios/jwt/rol.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../servicios/alert.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit{

  private readonly _rolService = inject(RolService)
  private readonly _usuarioService = inject(UsuarioService);
  private readonly _tokenService = inject(TokenService)
  private readonly _alertService = inject(AlertService);
  private fb = inject(FormBuilder);
  usuario: User = {}
  signInForm = this.fb.group({
    id: [this.usuario.id],
    nombre: [this.usuario.nombre, Validators.required],
    apellidos: [this.usuario.apellidos, Validators.required],
    userName: [this.usuario.userName, Validators.required],
    email: [this.usuario.email, [Validators.required, Validators.email]],
    password: [null, Validators.compose([ Validators.minLength(5), Validators.maxLength(10)])
    ],
  });

  loggedUserId: number | null = null;

  constructor(private router: Router, private location: Location, private activatedRoute: ActivatedRoute) {}


ngOnInit(): void {

  this.loggedUserId = this._rolService.getUsuarioId();
  const id = this.activatedRoute.snapshot.paramMap.get('id');

  console.log("id logueado: " + this.loggedUserId);
  console.log("id de la url: " + id);
  if (id) {
    this._usuarioService.getUsuarioData(Number(id)).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.rellenarForm();
      },
      error: (error) => {
        alert("Error al obtener usuario por ID");
        console.error(error);
      }
    });
  } else {
    this._usuarioService.getUserData().subscribe({
      next: (response) => {
        this.usuario = response;
        this.rellenarForm();
      },
      error: (errorData) => { alert(errorData) },
      complete: () => { console.log("user data ok") }
    });
  }
}

  rellenarForm() {
    this.signInForm.patchValue({
      id: this.usuario.id,
      nombre: this.usuario.nombre,
      apellidos: this.usuario.apellidos,
      userName: this.usuario.userName,
      email: this.usuario.email
    });
  }

    hide = true;
    clickEvent(event: MouseEvent) {
      this.hide = !this.hide;
      event.stopPropagation();
    }

    onSubmit() {
      let resp: {mensaje: string};
      if (this.signInForm.valid) {
        this._alertService
          .confirmBox("Editar datos", "¿Está seguro de editar su datos personales?")
          .then((result) => {
            if (result.value) {
              this._usuarioService.putUpdateDataAdmin(this.signInForm.value as User).subscribe({
                next: (response) => {
                  resp = response
                },
                error: (error) => {alert(error)},
                complete: () =>
                  {
                    this._alertService.alertWithSuccess(resp.mensaje);
                    this.location.back();
                  }
              })
            }
          })
      }
    }

    logout():void
  {
    this._tokenService.removeToken()
    window.location.reload();
  }

  irAInicio() {
    this.router.navigateByUrl('/participante/inicio');
  }

  eliminar(): void{
    const idToDelete = this.activatedRoute.snapshot.paramMap.get('id');
    const nombre = this.signInForm.controls['nombre']?.value;

    if (idToDelete === null || idToDelete === undefined) {
      this._alertService.alertWithError("No se pudo obtener el usuario a eliminar");
      return;
    }

    this._alertService.confirmBox(
      "Eliminar usuario",
       `¿Está seguro de que desea eliminar el usuario con ID: ${nombre}? Esta acción es irreversible.`
    )

    .then(
      (result) => {
        if (result.value) {
          this._usuarioService.deleteUsuarioDataAdmin(Number(idToDelete)).subscribe({
            next: () => {
              this._alertService.alertWithSuccess("Usuario eliminado de manera exitosa.")
              this._tokenService.removeToken(); 
              this.router.navigateByUrl(''); 
            },
            error: (err) =>{
              this._alertService.alertWithError("Error al eliminar la cuenta.");
              console.error('Error al eliminar usuario:', err);
            }

          })
        }
      }

    )
  }

}
