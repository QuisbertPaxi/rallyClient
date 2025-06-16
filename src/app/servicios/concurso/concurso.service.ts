import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { TokenService } from '../jwt/token.service';
import { Observable, catchError } from 'rxjs';
import { ApiResponseConsurso } from '../../modelos/api.response-concurso';

@Injectable({
  providedIn: 'root'
})
export class ConsursoService {
  private readonly _http = inject(HttpClient);
  private readonly _URL = environment.HOST_URL;
  private readonly _tokenService = inject(TokenService);

  constructor() { }

  getConcurso(){
    return this._http.get(this._URL+'concurso');
  }

  updateConcurso(idUsuario: number, nuevoConcurso: ApiResponseConsurso):Observable<any>{
    const token = this._tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `${this._URL}concurso/Update/${idUsuario}`;
    return this._http.put(url, nuevoConcurso, { headers }).pipe(
      catchError(error => {
        console.error('Error al actualizar concurso: ', error);
        throw error;
      })
    );
  }
}
