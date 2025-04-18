export interface Link {
    id?: string;
    title: string;
    description: string;
    imageUrl: string;
    route: string;
    category: string;
    createdAt: Date;
    createdBy: string;
    likes?: number;
    niveau?: 'Junior' | 'Médior' | 'Senior';
    tags?: string[];
    isPaid?: boolean;
    type?: 'Cours' | 'Projet' | 'Forum' | 'Exercice';
}
