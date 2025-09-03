export interface Link {
    id?: string;
    title: string;
    description: string;
    imageUrl: string;
    route?: string;
    category?: string;
    createdAt: Date;
    createdBy: string;
    likes?: number;
    url: string;
    niveau?: 'Junior' | 'Médior' | 'Senior';
    tags?: string[];
    isPaid?: boolean;
    type?: 'Cours' | 'Projet' | 'Forum' | 'Exercice' | 'Tutoriel' | 'Documentation' | 'Vidéo' | 'Podcast';
    likedBy?: string[];
    views?: number;
    averageRating?: number;
    totalRatings?: number;
    userRatings?: { [userId: string]: number };
}
