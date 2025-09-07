import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-home-layout',
    standalone: true,
    imports: [CommonModule, RouterModule,],
    templateUrl: './home-layout.component.html',
})
export class HomeLayoutComponent { } 