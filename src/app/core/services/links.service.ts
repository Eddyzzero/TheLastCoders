import { Injectable, inject, PLATFORM_ID, Inject, signal } from '@angular/core';
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
    private linksSignal = signal<Link[]>([]);

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
            return of([]);
        }

        if (!userId) {
            return of([]);
        }

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
                // Trier les liens côté client en attendant que l'index soit créé
                const sortedLinks = [...links].sort((a, b) => {
                    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt.seconds * 1000);
                    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt.seconds * 1000);
                    return dateB.getTime() - dateA.getTime(); // tri décroissant
                });

                // Si aucun lien n'est trouvé, vérifions tous les liens et leur createdBy
                if (links.length === 0) {
                    // Cette partie est à des fins de débogage uniquement
                    const allLinksQuery = query(linksCollection);
                    collectionData(allLinksQuery, { idField: 'id' }).subscribe((allLinks: any[]) => {
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

    async deleteLink(linkId: string) {
        const user = this.authService.getCurrentUser();
        if (!user) throw new Error("L'utilisateur doit être authentifié");

        try {
            // Récupérer le lien
            const linkRef = doc(this.firestore, `links/${linkId}`);
            const linkDoc = await getDoc(linkRef);

            if (!linkDoc.exists()) {
                throw new Error("Le lien à supprimer n'existe pas");
            }

            const linkData = linkDoc.data() as Link;

            // Vérifier que l'utilisateur est bien le propriétaire
            if (linkData.createdBy !== user.uid) {
                throw new Error("Vous n'êtes pas autorisé à supprimer ce lien");
            }

            // Supprimer le document
            await deleteDoc(linkRef);

            // Mettre à jour le signal des liens
            const currentLinks = this.linksSignal();
            const updatedLinks = currentLinks.filter(link => link.id !== linkId);
            this.linksSignal.set(updatedLinks);

        } catch (error) {
            throw error;
        }
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

    /**
     * Crée un lien avec une image en base64 (sans utiliser Firebase Storage)
     */
    async createLinkWithBase64Image(link: Omit<Link, 'id' | 'createdAt' | 'createdBy' | 'likes' | 'imageUrl'>, base64Image: string): Promise<any> {
        const user = this.authService.getCurrentUser();
        if (!user) throw new Error("L'utilisateur doit être authentifié");

        const linkData = {
            ...link,
            imageUrl: base64Image, // Utiliser directement l'image base64
            createdAt: new Date(),
            createdBy: user.uid,
            likes: 0
        };

        const linksCollection = collection(this.firestore, 'links');
        return addDoc(linksCollection, linkData);
    }

    async toggleLike(linkId: string, userId: string): Promise<void> {
        try {
            const linkRef = doc(this.firestore, `links/${linkId}`);
            const linkDoc = await getDoc(linkRef);

            if (!linkDoc.exists()) {
                throw new Error('Link not found');
            }

            const linkData = linkDoc.data() as Link;
            const likedBy = linkData.likedBy || [];
            const isLiked = likedBy.includes(userId);

            const updatedLikedBy = isLiked
                ? likedBy.filter((id: string) => id !== userId)
                : [...likedBy, userId];

            await updateDoc(linkRef, {
                likedBy: updatedLikedBy,
                likes: updatedLikedBy.length
            });

            // Mettre à jour le signal des liens
            const currentLinks = this.linksSignal();
            const updatedLinks = currentLinks.map((link: Link) => {
                if (link.id === linkId) {
                    return {
                        ...link,
                        likedBy: updatedLikedBy,
                        likes: updatedLikedBy.length
                    };
                }
                return link;
            });
            this.linksSignal.set(updatedLinks);

        } catch (error) {
            throw error;
        }
    }

    async rateLink(linkId: string, userId: string, rating: number): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const linkRef = doc(this.firestore, 'links', linkId);
        const linkDoc = await getDoc(linkRef);
        const linkData = linkDoc.data() as Link;

        const userRatings = linkData.userRatings || {};
        userRatings[userId] = rating;

        // Calculate new average rating
        const ratings = Object.values(userRatings);
        const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

        await updateDoc(linkRef, {
            userRatings,
            averageRating,
            totalRatings: ratings.length
        });
    }

    getUserRating(link: Link, userId: string): number {
        return link.userRatings?.[userId] || 0;
    }
}
