import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/anonimo/inicio/inicio.component';
import { LogInComponent } from './componentes/anonimo/log-in/log-in.component';
import { SignUpComponent } from './componentes/anonimo/sign-up/sign-up.component';
import { GaleriaComponent } from './componentes/anonimo/galeria/galeria.component';
import { EstadisticasComponent } from './componentes/anonimo/estadisticas/estadisticas.component';
import { MenuComponent } from './componentes/administrador/menu/menu.component';
import { PrincipalComponent } from './componentes/administrador/principal/principal.component';
import { PerfilComponent } from './componentes/administrador/perfil/perfil.component';
import { ListConcursoComponent } from './componentes/administrador/list-concurso/list-concurso.component';
import { rolGuard } from './guards/rol.guard';
import { redirectIfAuthenticatedGuard } from './guards/redirect.guard';
import { EditConcursoComponent } from './componentes/administrador/edit-concurso/edit-concurso.component';
import { MenuConsuComponent } from './componentes/participante/menu/menu.component';
import { PrincipalPComponent } from './componentes/participante/principal/principal.component';
import { AddFotografiaComponent } from './componentes/participante/add-fotografia/add-fotografia.component';
import { MenuToolbarComponent } from './componentes/anonimo/menu-toolbar/menu-toolbar.component';
import {  UsuariosAdminComponent } from './componentes/administrador/usuarios-admin/usuarios-admin.component';

export const routes: Routes = [

    {
      path: '',
      component: MenuToolbarComponent,
      canActivate: [redirectIfAuthenticatedGuard],
      children: [
      { path: '', component: InicioComponent },
      { path: 'Galeria', component: GaleriaComponent },
      { path: 'Stats', component: EstadisticasComponent },
      ]
    },
    {
        path: "LogIn",
        canActivate: [redirectIfAuthenticatedGuard],
        component: LogInComponent
    },
    {
        path: "SignUp",
        canActivate: [redirectIfAuthenticatedGuard],
        component: SignUpComponent
    },
    {
        path: "admin",
        component: MenuComponent,
        canActivateChild:[rolGuard],
        data: {expectedRole: 'admin'},
        children: [
            { path: 'inicio', component: PrincipalComponent, data: { expectedRole: 'admin' } },
            { path: 'perfil', component: PerfilComponent, data: { expectedRole: 'admin' } },
            { path: 'perfil/User/:id', component: PerfilComponent, data: { expectedRole: 'admin' }},
            { path: 'concurso', component: ListConcursoComponent, data: { expectedRole: 'admin' } },
            { path: 'editConcurso/:id', component: EditConcursoComponent, data: { expectedRole: 'admin' }},
            { path: 'usersAdmin', component: UsuariosAdminComponent, data: { expectedRole: 'admin' }},
            { path: '', redirectTo: 'inicio', pathMatch: 'full' },
            { path: '**', redirectTo: 'inicio' }
          ]
    },
    {
        path: "participante",
        component: MenuConsuComponent,
        canActivateChild:[rolGuard],
        data: {expectedRole: 'participante'},
        children: [
            { path: 'inicio', component: PrincipalPComponent, data: { expectedRole: 'participante' } },
            { path: 'perfil', component: PerfilComponent, data: { expectedRole: 'participante' } },
            { path: 'addFotografia', component: AddFotografiaComponent, data: { expectedRole: 'participante' }},
            { path: 'addFotografia/:id', component: AddFotografiaComponent, data: { expectedRole: 'participante' }},
            { path: '', redirectTo: 'inicio', pathMatch: 'full' },
            { path: '**', redirectTo: 'inicio' }
          ]
    },
    {
        path: '**',
        redirectTo: ''
    },


];
