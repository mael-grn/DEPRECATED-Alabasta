export interface User {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    is_approved: boolean;
    is_admin: boolean;
    is_public: boolean;
    created_at: Date;
}

export interface InsertableUser {
    username: string;
    first_name: string;
    last_name: string;
    is_public: boolean;
    password: string;
    is_admin?: boolean; // Optional, defaults to false
    is_approved?: boolean; // Optional, defaults to false
}

