import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { LoginRequest } from '../../modelos/loginRequest';
import { RegisterRequest } from '../../modelos/registerRequest';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly _http = inject(HttpClient)
  private readonly _URL = environment.HOST_URL

  login(user: LoginRequest): Observable <{token: string }> 
  {
    return this._http.post<{token: string}>(this._URL+'auth/login', user).pipe(
      catchError(this.handleError)
    )
  }

  register(user: RegisterRequest): Observable <{token: string }> 
  {
    return this._http.post<{token: string}>(this._URL+'auth/registro', user).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error:HttpErrorResponse){
    if(error.status===0){
      console.error('Se ha producio un error ', error.error);
    }
    else{
      console.error('Backend retornó el código de estado ', error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }

}
