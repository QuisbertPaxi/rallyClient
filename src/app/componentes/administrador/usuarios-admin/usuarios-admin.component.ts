import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioService } from '../../../servicios/usuario.service';
import { RouterModule, Router } from '@angular/router';
import { User } from '../../../modelos/user';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.scss'
})
export class UsuariosAdminComponent {
  private readonly _usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  usuarios!: User [];

  ngOnInit(): void {
    this._usuarioService.getAllUser().subscribe({
      next: (data) => {
        this.usuarios = data
      },
      error: (err) => console.error('Error al obtener usuarios', err)
    });
  }

  editarUsuario(id: number) {
    this.router.navigate(['admin/perfil/User/',id])
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this._usuarioService.deleteUsuarioDataAdmin(id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== id);
        },
        error: (err) => console.error('Error al eliminar usuario', err)
      });
    }
  }
}
