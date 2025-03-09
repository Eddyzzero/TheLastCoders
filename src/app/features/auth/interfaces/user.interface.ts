export interface UserInterface {
    id?: string;
    userName: string;
    email: string;
    createdAt: Date;
}

//there we create the users roles
export interface UsersRoles {
    reader: boolean;
    author?: boolean
    admin?: boolean;
}