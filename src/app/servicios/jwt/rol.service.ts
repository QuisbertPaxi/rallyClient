import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private readonly tokenService: TokenService) { }

  getUsuarioRol(): string 
  {
    const token = this.tokenService.getToken()

    if (!token) { return "" }

    const tokenPayload = environment.decodeToken(token);
    return tokenPayload.roles ?? "";

  }

  getUsuarioId(): number
  {
    const token = this.tokenService.getToken();  
    if (!token) {return 0 }

    const tokenPayload = environment.decodeToken(token);
    return tokenPayload.id ?? 0
  }
}

