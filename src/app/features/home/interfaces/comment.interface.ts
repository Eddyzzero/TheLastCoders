export interface Comment {
    id?: string;
    text: string;
    senderId: string;
    senderName: string;
    linkId: string;
    createdAt: Date;
    senderImage?: string;
    likes: number;
    likedBy: string[];
    isEdited?: boolean;
    editedAt?: Date;
    read?: boolean;
    parentId?: string;
}
