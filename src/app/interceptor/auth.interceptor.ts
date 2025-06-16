import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../servicios/jwt/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService)
  const token = tokenService.getToken()

  if (token) 
  {
    const headers = req.headers.set('Authorization', `Bearer ${token}`)
    const reqClon = req.clone({ headers }) 

    return next(reqClon)
  } 

  return next(req);
};
