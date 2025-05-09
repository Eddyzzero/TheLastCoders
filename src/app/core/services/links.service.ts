import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Firestore, collection, collectionData, query, orderBy, addDoc, deleteDoc, doc, updateDoc, where, getDoc } from '@angular/fire/firestore';
import { Observable, of, from, switchMap, map } from 'rxjs';
import { Link } from '../../features/home/interfaces/link.interface';
import { AuthService } from './fireAuth.service';
import { FirestorageService } from './firestorage.service';

@Injectable({
    providedIn: 'root'
})
export class LinksService {
    private firestore = inject(Firestore);
    private authService = inject(AuthService);
    private firestorageService = inject(FirestorageService);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    getLinks(): Observable<Link[]> {
        if (!isPlatformBrowser(this.platformId)) {
            return of([]);
        }
        const linksCollection = collection(this.firestore, 'links');
        const linksQuery = query(linksCollection, orderBy('createdAt', 'desc'));
        return collectionData(linksQuery, { idField: 'id' }) as Observable<Link[]>;
    }

    getLinksByUser(userId: string): Observable<Link[]> {
        if (!isPlatformBrowser(this.platformId)) {
            console.log('Non exécuté côté navigateur');
            return of([]);
        }

        if (!userId) {
            console.error('getLinksByUser: userId non fourni');
            return of([]);
        }

        console.log('Recherche des liens pour userId:', userId);

        const linksCollection = collection(this.firestore, 'links');

        // Solution temporaire sans orderBy pour éviter l'erreur d'index
        // À remplacer une fois que l'index est créé
        const linksQuery = query(
            linksCollection,
            where('createdBy', '==', userId)
            // orderBy('createdAt', 'desc') - temporairement commenté
        );

        return collectionData(linksQuery, { idField: 'id' }).pipe(
            map((links: any[]) => {
                console.log(`${links.length} liens trouvés pour l'utilisateur ${userId}`);

                // Trier les liens côté client en attendant que l'index soit créé
                const sortedLinks = [...links].sort((a, b) => {
                    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt.seconds * 1000);
                    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt.seconds * 1000);
                    return dateB.getTime() - dateA.getTime(); // tri décroissant
                });

                // Si aucun lien n'est trouvé, vérifions tous les liens et leur createdBy
                if (links.length === 0) {
                    console.log('Aucun lien trouvé, vérification de tous les liens...');
                    // Cette partie est à des fins de débogage uniquement
                    const allLinksQuery = query(linksCollection);
                    collectionData(allLinksQuery, { idField: 'id' }).subscribe((allLinks: any[]) => {
                        console.log('Tous les liens:', allLinks.length);
                        console.log('Valeurs createdBy:', allLinks.map(link => link.createdBy));
                    });
                }

                return sortedLinks as Link[];
            })
        );
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

    async createLinkWithImage(link: Omit<Link, 'id' | 'createdAt' | 'createdBy' | 'likes'>, imageFile: File) {
        const user = this.authService.getCurrentUser();
        if (!user) throw new Error("L'utilisateur doit être authentifié");

        // Générer un nom unique pour l'image
        const fileName = this.firestorageService.generateUniqueFileName(imageFile);
        const imagePath = `links/${user.uid}/${fileName}`;

        // Debug pour vérifier l'ID utilisateur
        console.log('Utilisateur créant le lien:', user.uid);

        // Upload l'image et créer le lien
        return this.firestorageService.uploadImage(imageFile, imagePath).pipe(
            switchMap(imageUrl => {
                const linkData = {
                    ...link,
                    imageUrl,
                    createdAt: new Date(),
                    createdBy: user.uid, // Assurez-vous que c'est le même format utilisé dans getLinksByUser
                    likes: 0
                };

                console.log('Données du lien créé:', linkData);
                const linksCollection = collection(this.firestore, 'links');
                return from(addDoc(linksCollection, linkData));
            })
        ).toPromise();
    }

    async deleteLink(linkId: string) {
        const user = this.authService.getCurrentUser();
        if (!user) throw new Error("L'utilisateur doit être authentifié");

        // Récupérer le lien pour obtenir l'URL de l'image
        const linkRef = doc(this.firestore, `links/${linkId}`);
        const linkDoc = await getDoc(linkRef);

        if (linkDoc.exists()) {
            const linkData = linkDoc.data() as Link;
            if (linkData.imageUrl) {
                // Extraire le chemin de l'image depuis l'URL
                const imagePath = linkData.imageUrl.split('/').slice(-2).join('/');
                // Supprimer l'image
                await this.firestorageService.deleteImage(`links/${imagePath}`).toPromise();
            }
        }

        // Supprimer le document
        return deleteDoc(linkRef);
    }

    async updateLink(linkId: string, data: Partial<Link>, newImageFile?: File) {
        const user = this.authService.getCurrentUser();
        if (!user) throw new Error("L'utilisateur doit être authentifié");

        const linkRef = doc(this.firestore, `links/${linkId}`);

        if (newImageFile) {
            // Si une nouvelle image est fournie, la télécharger
            const fileName = this.firestorageService.generateUniqueFileName(newImageFile);
            const imagePath = `links/${user.uid}/${fileName}`;
            const imageUrl = await this.firestorageService.uploadImage(newImageFile, imagePath).toPromise();

            // Mettre à jour le document avec la nouvelle URL d'image
            return updateDoc(linkRef, {
                ...data,
                imageUrl,
                updatedAt: new Date()
            });
        }

        // Si pas de nouvelle image, mettre à jour uniquement les autres données
        return updateDoc(linkRef, {
            ...data,
            updatedAt: new Date()
        });
    }

    async updateLikes(linkId: string, increment: boolean) {
        const linkRef = doc(this.firestore, `links/${linkId}`);
        return updateDoc(linkRef, {
            likes: increment ? increment : -1
        });
    }

    getLinkById(id: string): Observable<Link | null> {
        if (!isPlatformBrowser(this.platformId)) {
            return of(null);
        }
        const linkRef = doc(this.firestore, `links/${id}`);
        return from(getDoc(linkRef)).pipe(
            map(doc => {
                if (doc.exists()) {
                    return { id: doc.id, ...doc.data() } as Link;
                }
                return null;
            })
        );
    }
}
