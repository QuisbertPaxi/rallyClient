import { Component, inject} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { TokenService } from '../../../servicios/jwt/token.service';
import { UsuarioService } from '../../../servicios/usuario.service';
import { User } from '../../../modelos/user';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterModule,
    CommonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly _tokenService = inject(TokenService)
  private readonly route = inject(Router)
  private readonly _usuarioService = inject(UsuarioService)
  adminDatos: User = {} as User;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    ngOnInit(): void {
      this._usuarioService.getUserData().subscribe({
        next: (us: User) => {
          this.adminDatos = us;
        },
        error: err => {
          alert('No se pudo obtener el participante.');
        }
      });
    }

    logout():void
    {
      this._tokenService.removeToken()
      this.route.navigateByUrl("/")
    }
}
