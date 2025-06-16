import { Component, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { RegisterRequest } from '../../../modelos/registerRequest';
import { LoginService } from '../../../servicios/auth/login.service';
import { AlertService } from '../../../servicios/alert.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports:  [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  private readonly fb = inject(FormBuilder);
  private readonly _loginService = inject(LoginService);
  private readonly _alertService = inject(AlertService);
  private readonly _router = inject(Router)
  signInForm = this.fb.group({
    nombre: [null, Validators.required],
    apellidos: [null, Validators.required],
    userName: [null, Validators.required],
    email: [null,[Validators.required, Validators.email]],
    password: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(8)])
    ],
    role: ["participante"]
  });

  hide = true;
  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }


  onSubmit() {
    if (this.signInForm.valid) {
      this._loginService.register(this.signInForm.value as RegisterRequest).subscribe({
        next:(response) =>
        {
          console.log(response);
        },
        error:(respError) => {
          this._alertService.alertWithError(respError);
        },
        complete: () =>
        {
          this._alertService.alertWithSuccess("Registrado correctamente!!!. Por favor, inicie sesión");
          this.signInForm.reset()
          this._router.navigateByUrl("/LogIn")
        }
      })
    }
  }
}
