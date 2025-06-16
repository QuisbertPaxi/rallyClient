import { Component, OnInit, inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

// Models
import { User } from '../../../modelos/user';
import { ApiResponseConsurso } from '../../../modelos/api.response-concurso';

// Services
import { UsuarioService } from '../../../servicios/usuario.service';
import { ConsursoService } from '../../../servicios/concurso/concurso.service';
import { AlertService } from '../../../servicios/alert.service';

registerLocaleData(localeEs);

@Component({
  selector: 'app-edit-concurso',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterLink
  ],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
  templateUrl: './edit-concurso.component.html',
  styleUrl: './edit-concurso.component.scss'
})
export class EditConcursoComponent implements OnInit {
  // Injected services
  private readonly fb = inject(FormBuilder);
  private readonly _concursoService = inject(ConsursoService);
  private readonly _routeAc = inject(ActivatedRoute);
  private readonly _usuarioService = inject(UsuarioService);
  private readonly _alertService = inject(AlertService);
  private readonly datePipe = inject(DatePipe);
  private readonly router = inject(Router);

  // Component properties
  concurso: ApiResponseConsurso = {};
  datosConcurso: ApiResponseConsurso = {};
  datosUsuario: User = {};
  id = this._routeAc.snapshot.params["id"];

  // Form definition
  editCon = this.fb.group({
    descripcion: ['', Validators.required],
    fechaVinicio: [this.concurso.fechaInicioVotacion, Validators.required],
    fechaVfin: [this.concurso.fechaFinVotacion, Validators.required],
    fechaEinicio: [this.concurso.fechaInicioEnvio, Validators.required],
    fechaEfin: [this.concurso.fechaFinEnvio, Validators.required],
    fechaAnuncio: [this.concurso.fechaAnuncio, Validators.required],
    nfotografias: [this.concurso.numeroFotografias, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.loadUserData();
    this.loadConcursoData();
  }

  private loadUserData(): void {
    this._usuarioService.getUserData().subscribe({
      next: (us) => {
        this.datosUsuario = us;
      }
    });
  }

  private loadConcursoData(): void {
    this._concursoService.getConcurso().subscribe({
      next: (data) => {
        this.datosConcurso = data;
        this.updateFormWithConcursoData();
      },
      error: (err) => {
        console.error("Error al obtener el concurso:", err);
      }
    });
  }

  private updateFormWithConcursoData(): void {
    this.editCon.patchValue({
      descripcion: this.datosConcurso.descripcion,
      fechaEinicio: this.toLocalDate(this.datosConcurso.fechaInicioEnvio),
      fechaEfin: this.toLocalDate(this.datosConcurso.fechaFinEnvio),
      fechaVinicio: this.toLocalDate(this.datosConcurso.fechaInicioVotacion),
      fechaVfin: this.toLocalDate(this.datosConcurso.fechaFinVotacion),
      fechaAnuncio: this.toLocalDate(this.datosConcurso.fechaAnuncio),
      nfotografias: this.datosConcurso.numeroFotografias
    });
  }

  private toLocalDate(dateStr: string | Date | null | undefined): Date | null {
    if (!dateStr) return null;
    const parts = (dateStr + '').split('-'); // Asume 'yyyy-MM-dd'
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  onSubmit(): void {
    this.updateConcursoFromForm();
    
    this._alertService.confirmBox("Guardar", `¿Está seguro de guardar los cambios del concurso?`)
      .then((result) => {
        if (result.value) {
          this.saveConcursoChanges();
        }
      });
  }

  private updateConcursoFromForm(): void {
    this.concurso = {
      ...this.concurso,
      descripcion: this.editCon.value.descripcion,
      fechaInicioEnvio: this.formatDateToString(this.editCon.value.fechaEinicio),
      fechaFinEnvio: this.formatDateToString(this.editCon.value.fechaEfin),
      fechaInicioVotacion: this.formatDateToString(this.editCon.value.fechaVinicio),
      fechaFinVotacion: this.formatDateToString(this.editCon.value.fechaVfin),
      fechaAnuncio: this.formatDateToString(this.editCon.value.fechaAnuncio),
      numeroFotografias: this.editCon.value.nfotografias
    };
  }

  private formatDateToString(date: string | Date | null | undefined): string | null {
    if (!date) return null;
    
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private saveConcursoChanges(): void {
    this._concursoService.updateConcurso(this.datosUsuario.id!, this.concurso).subscribe({
      next: (res) => {
        this._alertService.alertWithSuccess("¡Actualización exitosa! Sus datos se han guardado correctamente.");
        this.navigateToList();
      },
      error: (err) => {
        this._alertService.alertWithError("Hubo un error en el guardado. Por favor, inténtelo más tarde");
        console.error("Error al actualizar", err);
      }
    });
  }

  private navigateToList(): void {
    this.router.navigate(['/admin/concurso']);
  }
}