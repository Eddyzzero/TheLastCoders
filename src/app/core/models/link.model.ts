export interface Link {
    id?: string;
    title: string;
    url: string;
    description?: string;
    userId: string;
    createdAt: Date;
    likes?: number;
    comments?: number;
}
