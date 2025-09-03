export interface UserImageUrl {
    url: string;
    base64: string;
    createdAt: Date;
}

export interface UserInterface {
    id?: string;
    userName: string;
    email: string;
    createdAt: Date;
    role?: 'reader' | 'author' | 'admin';
    userImageUrl?: UserImageUrl;
    bio?: string;
    skills?: string[];
    socialLinks?: {
        github?: string;
        linkedin?: string;
        twitter?: string;
    };
}

// on creer ici les roles
export interface UsersRoles {
    reader: boolean;
    author?: boolean;
    admin?: boolean;
}