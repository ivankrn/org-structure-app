import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { OrganizationalTreeComponent } from './component/organizational-tree/organizational-tree.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxSliderModule, OrganizationalTreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'org-structure-app-frontend';
}
