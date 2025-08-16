import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ViewMode = 'grid' | 'carousel';

@Injectable({
    providedIn: 'root'
})
export class ViewModeService {
    private viewModeSubject = new BehaviorSubject<ViewMode>('carousel');
    public viewMode$ = this.viewModeSubject.asObservable();

    constructor() { }

    setViewMode(mode: ViewMode): void {
        this.viewModeSubject.next(mode);
    }

    getCurrentViewMode(): ViewMode {
        return this.viewModeSubject.value;
    }

    toggleViewMode(): void {
        const currentMode = this.viewModeSubject.value;
        const newMode = currentMode === 'grid' ? 'carousel' : 'grid';
        this.viewModeSubject.next(newMode);
    }
}
