import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

/** Esta clase se encarga de gestionar el TOKEN de autenticación de JWT */

export class TokenService {

  // se usa como clave para almacenar y recuperar el token JWT del localStorage
  private readonly tokenKey: string = "token";

  constructor() { }

  setToken(token: string): void
  {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null
  {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void
  {
    return localStorage.removeItem(this.tokenKey);
  }

  isTokenExpired(): boolean
  {
    const token = this.getToken();

    if (!token) 
    {
      return true;
    }

    const tokenPayload = environment.decodeToken(token);
    const exp = tokenPayload.exp;

    if (!exp) 
    {
      return true;
    }

    const currentTime = Math.floor(new Date().getTime() / 1000)

    return currentTime > exp; // si el tiempo actual es mayor el token ha expirado (true)

  }

}
