import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
    @Input() show = false;
    @Input() message = '';
    @Input() type: 'success' | 'error' | 'info' | 'warning' = 'success';

    typeClasses = {
        success: 'bg-apple-green text-white',
        error: 'bg-red-400 text-white',
        info: 'bg-blue-400 text-white',
        warning: 'bg-yellow-400 text-white'
    };

    typeIcons = {
        success: 'check_circle',
        error: 'error',
        info: 'info',
        warning: 'warning'
    };
}
