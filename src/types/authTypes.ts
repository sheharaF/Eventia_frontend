export interface User {
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    message: string;
    token?: string;
    role?: string;
}