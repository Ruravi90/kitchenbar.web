export interface ClientUser {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ClientAddress {
    id?: number;
    clientUserId?: number;
    tagName: string;
    address: string;
    zipCode: string;
    instructions?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface FavoriteBranch {
    id?: number;
    clientUserId: number;
    branchId: number;
    branch?: any; // Define Branch interface if available, or use any for now
    createdAt?: string;
}

export interface LoginResponse {
    code: number;
    messages: string;
    data: {
        token: string;
        user: ClientUser;
    };
}
