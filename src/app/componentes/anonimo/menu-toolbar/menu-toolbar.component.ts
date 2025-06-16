import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from  '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbar,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    RouterLink,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './menu-toolbar.component.html',
  styleUrl: './menu-toolbar.component.scss'
})
export class MenuToolbarComponent {

}
