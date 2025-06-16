import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { TokenService } from '../servicios/jwt/token.service';
import { RolService } from '../servicios/jwt/rol.service';

export const rolGuard: CanActivateChildFn = (childRoute, state) => {
  
  const tokenService = inject(TokenService)
  const roleService = inject(RolService)
  const router = inject(Router)

  const expectedRole = childRoute.data['expectedRole'];

  if (tokenService.isTokenExpired()) 
  {
    tokenService.removeToken();
    router.navigateByUrl("/LogIn");
    return false;
  }

  if (!roleService.getUsuarioRol().includes(expectedRole)) 
  {
   router.navigateByUrl("/")
   return false
  }
  return true;
};
