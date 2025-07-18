import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../../../core/components/nav-bar/nav-bar.component';

@Component({
    selector: 'app-home-layout',
    imports: [CommonModule, RouterModule,],
    templateUrl: './home-layout.component.html',
})
export class HomeLayoutComponent { } 