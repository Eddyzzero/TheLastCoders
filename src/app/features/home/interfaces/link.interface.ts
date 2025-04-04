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
}
