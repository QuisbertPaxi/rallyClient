import { Component, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AlertService } from '../../../servicios/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core'; // Asegúrate de importar MatNativeDateModule
import { FotografiaService } from '../../../servicios/fotografia/fotografia.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponseFotografia } from '../../../modelos/api-response-fotografia';
import { UsuarioService } from '../../../servicios/usuario.service';
import { User } from '../../../modelos/user';
import { ConsursoService } from '../../../servicios/concurso/concurso.service';

@Component({
  selector: 'app-add-fotografia',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' } // Opcional: configurar el idioma
  ],
  templateUrl: './add-fotografia.component.html',
  styleUrl: './add-fotografia.component.scss'
})
export class AddFotografiaComponent {
  participanteDatos: User = {} as User;
  private readonly _usuarioService = inject(UsuarioService)
  private readonly _concursoService = inject(ConsursoService)
  private readonly _fb = inject(FormBuilder);
  private readonly _http = inject(HttpClient);
  private readonly _fotoService = inject(FotografiaService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly _alertService = inject(AlertService);
  fotografia: ApiResponseFotografia = {} as ApiResponseFotografia;
  isEdit:boolean = false;
  texto_boton:string = 'Subir Foto';
  texto_max_fotos = '';
  texto_total_fotos = '';
  alert_excedido = '';
  puedeEnviar = true;

  fotoForm: FormGroup = this._fb.group({
    titulo: ['', Validators.required],
    descripcion: ['']
  });

  selectedFile: File | null = null;

  constructor(private readonly router: Router, 
              private readonly route: ActivatedRoute,){}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this._usuarioService.getUserData().subscribe({
        next: (us: User) => {
          this.participanteDatos = us;
        },
        error: err => {
          console.error('Error al obtener participante:', err);
          alert('No se pudo obtener el participante.');
        }
      });
      this.isEdit = true;
      this.texto_boton = 'Editar Foto';
      this._fotoService.getFotografiaId(+id).subscribe((foto) => {
        this.fotoForm.patchValue({
          titulo: foto.titulo,
          descripcion: foto.descripcion
        });
      this.fotografia = foto;
      });
    }else{
      this._usuarioService.getUserData().subscribe({
        next: (us: User) => {
          this.participanteDatos = us;
          this._concursoService.getConcurso().subscribe({
            next: (concurso: any) => {
              const max_fotos = concurso.numeroFotografias;
              this.texto_max_fotos = 'Recuerde que puede subir hasta ' + max_fotos + ' fotografías';
              this._fotoService.getCountFotografias(this.participanteDatos.id!).subscribe({
                next: (conteo: number) => {
                  this.texto_total_fotos = 'Actualmente, usted ya subió ' + conteo + ' fotografías';
                  if(conteo >= max_fotos){
                    this.alert_excedido = 'Usted ya no puede subir más fotografías';
                    this.puedeEnviar = false;
                  }
                },
                error: err => {
                  console.error('No se pudieron obtener los datos del concurso:', err);
                }
              });  
            },
            error: err => {
              console.error('No se pudieron obtener los datos del concurso:', err);
            }
          });  
        },
        error: err => {
          console.error('Error al obtener participante:', err);
          alert('No se pudo obtener el participante.');
        }
      });
        
    }
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    const file: File = event.target.files[0] ?? null;
    if (!file) return;
  
    const maxSizeMB = 0.5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validExtensions = ['.jpg', '.jpeg', '.png'];
  
    const fileTypeValid = validTypes.includes(file.type);
    const fileNameValid = validExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );
  
    if (!fileTypeValid || !fileNameValid) {
      this._alertService.alertWithError('Solo se permiten imágenes en formato JPG, JPEG o PNG.');
      input.value = '';
      return;
    }
  
    if (file.size > maxSizeBytes) {
      this._alertService.alertWithError(`La imagen no debe superar los ${maxSizeMB}MB.`);
      input.value = ''; 
      return;
    }
  
    // Si pasa las validaciones, guarda el archivo
    this.selectedFile = file;
  }
  

  onSubmit() {
    let id = this.route.snapshot.paramMap.get('id');
    if (this.fotoForm.valid && (this.selectedFile || this.isEdit)) {
      // Primero actualizamos los datos comunes de la fotografía desde el formulario y usuario
      this.fotografia.titulo = this.fotoForm.value.titulo;
      this.fotografia.descripcion = this.fotoForm.value.descripcion;
      this.fotografia.idParticipante = this.participanteDatos.id;
      if (this.isEdit) {
        this.fotografia.id = +id!;
        this.fotografia.usuMod = this.participanteDatos.userName!;

        this._alertService
        .confirmBox("Editar fotografía", "¿Está seguro de editar la fotografía?")
        .then((result) => {
          if (result.value) {
            // Construimos FormData para enviar
            const formData = new FormData();
            if (this.selectedFile) {
              formData.append('file', this.selectedFile);
            }
            const fotografiaJson = new Blob([JSON.stringify(this.fotografia)], { type: 'application/json' });
            formData.append('fotografia', fotografiaJson);

            this._fotoService.updateFotografia(formData).subscribe({
              next: () => {
                this._alertService.alertWithSuccess(`¡Fotografía "${this.fotografia.titulo}" editada con éxito!`);
                this.router.navigate(['/participante/inicio']);
              },
              error: err => {
                console.error('Error al editar:', err);
                this._alertService.alertWithError('Hubo un problema al editar la fotografía');
              }
            });
          }
        });

      } else 
        if (this.fotoForm.valid && this.selectedFile) {
            this.fotografia.usuCre = this.participanteDatos.userName!;

            const formData = new FormData();
            formData.append('file', this.selectedFile);
            const fotografiaJson = new Blob([JSON.stringify(this.fotografia)], { type: 'application/json' });
            formData.append('fotografia', fotografiaJson);

            this._alertService
              .confirmBox("Subir fotografía", 
                "Tendrá que esperar a que aprueben su fotografía para participar en el rally")
              .then((result) => {
                if (result.value) {
                  this._fotoService.postFotografiaParticipante(formData).subscribe({
                    next: () => {
                      this._alertService.alertWithSuccess(`¡Fotografía "${this.fotografia.titulo}" subida con éxito!`);
                      this.router.navigate(['/participante/inicio']);
                    },
                    error: err => {
                      console.error('Error al subir:', err);
                      this._alertService.alertWithError('Hubo un problema al subir la fotografía');
                    }
                  });
                }
              });
        }
    }else{
      this.router.navigate(['/participante/inicio']);
    }
  }
  
  cancelar(){
    this.router.navigate(['/participante/inicio']);
  }
}
