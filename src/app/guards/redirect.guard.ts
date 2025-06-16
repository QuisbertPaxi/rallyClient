import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../servicios/jwt/token.service';
import { RolService } from '../servicios/jwt/rol.service';

export const redirectIfAuthenticatedGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const rolService = inject(RolService);
  const router = inject(Router);

  if (!tokenService.isTokenExpired()) {
    const rol = rolService.getUsuarioRol();
    if (rol === 'admin') {
      router.navigateByUrl('/admin/inicio');
    } else if (rol === 'participante') {
      router.navigateByUrl('/participante/inicio');
    } else {
      router.navigateByUrl('/');
    }
    return false; // impide el acceso a la ruta pública
  }

  return true; // si no está autenticado, permite ver la página pública
};
