import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Firestore, collection, collectionData, query, orderBy, addDoc, deleteDoc, doc, updateDoc, where } from '@angular/fire/firestore';
import { Observable, of, from } from 'rxjs';
import { Link } from '../../features/home/interfaces/link.interface';
import { AuthService } from './fireAuth.service';

@Injectable({
    providedIn: 'root'
})
export class LinksService {
    private firestore = inject(Firestore);
    private authService = inject(AuthService);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    getLinks(): Observable<Link[]> {
        if (!isPlatformBrowser(this.platformId)) {
            return of([]);
        }
        const linksCollection = collection(this.firestore, 'links');
        const linksQuery = query(linksCollection, orderBy('createdAt', 'desc'));
        return collectionData(linksQuery, { idField: 'id' }) as Observable<Link[]>;
    }

    getLinksByCategory(category: string): Observable<Link[]> {
        if (!isPlatformBrowser(this.platformId)) {
            return of([]);
        }
        const linksCollection = collection(this.firestore, 'links');
        const linksQuery = query(
            linksCollection,
            where('category', '==', category),
            orderBy('createdAt', 'desc')
        );
        return collectionData(linksQuery, { idField: 'id' }) as Observable<Link[]>;
    }

    async createLink(link: Omit<Link, 'id' | 'createdAt' | 'createdBy' | 'likes'>) {
        const user = this.authService.getCurrentUser();
        if (!user) throw new Error("L'utilisateur doit être authentifié");

        const linkData = {
            ...link,
            createdAt: new Date(),
            createdBy: user.uid,
            likes: 0
        };

        const linksCollection = collection(this.firestore, 'links');
        return addDoc(linksCollection, linkData);
    }

    async deleteLink(linkId: string) {
        const user = this.authService.getCurrentUser();
        if (!user) throw new Error("L'utilisateur doit être authentifié");

        const linkRef = doc(this.firestore, `links/${linkId}`);
        return deleteDoc(linkRef);
    }

    async updateLink(linkId: string, data: Partial<Link>) {
        const user = this.authService.getCurrentUser();
        if (!user) throw new Error("L'utilisateur doit être authentifié");

        const linkRef = doc(this.firestore, `links/${linkId}`);
        return updateDoc(linkRef, { ...data, updatedAt: new Date() });
    }

    async updateLikes(linkId: string, increment: boolean) {
        const linkRef = doc(this.firestore, `links/${linkId}`);
        return updateDoc(linkRef, {
            likes: increment ? increment : -1
        });
    }
}
