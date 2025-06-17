import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { RolService } from './jwt/rol.service';
import { User } from '../modelos/user';
import { Observable, catchError, throwError } from 'rxjs';
import { TokenService } from './jwt/token.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly _http = inject(HttpClient);
  private readonly _rolService = inject(RolService);
  private readonly _tokenService = inject(TokenService);
  private readonly _URL = environment.API_URL;

  getUserData()
  {
    const id = this._rolService.getUsuarioId();
    return this._http.get<User>(this._URL+'usuarios/'+id)
  }

  getUsuarioData(idOf: number| null | undefined)
  {
    return this._http.get<User>(this._URL+'usuarios/'+idOf)
  }

  putUpdateData(usuario: User)
  {
    const id = this._rolService.getUsuarioId();
    return this._http.put<{mensaje: string}>(this._URL+'usuarios/'+id, usuario).pipe(
      catchError(this.handleError)
    )
  }

  putUpdateDataAdmin(usuario: User)
  {
    const id = usuario.id;
    return this._http.put<{mensaje: string}>(this._URL+'usuarios/'+id, usuario).pipe(
      catchError(this.handleError)
    )
  }

  deleteUsuarioDataAdmin(id: number| null | undefined){
    return this._http.delete<{mensaje: string}>(this._URL+'usuarios/'+id).pipe(
      catchError(this.handleError)
    )
  }

  getAllUser(): Observable<any>{
    const token = this._tokenService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const idAdmin = this._rolService.getUsuarioId();

    return this._http.get(`${this._URL}usuarios/All/${idAdmin}`, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener los usuarios', error);
        throw error;
      })
    );
  }

  private handleError(error:HttpErrorResponse){
    if(error.status===0){
      console.error('Se ha produció un error ', error.error);
    }
    else{
      console.error('Backend retornó el código de estado ', error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }
}