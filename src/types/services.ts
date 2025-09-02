// src/types/Service.ts
// Updated to align with backend schema while keeping backward compatibility
export interface Service {
    _id?: string;
    // New canonical fields from backend
    name?: string;
    serviceType?: string;
    price?: number;
    location?: string | { city: string; district: string };
    image?: string;
    // Legacy fields kept optional for compatibility in UI
    title?: string;
    description: string;
    serviceCategory?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    capacity?: number;
    images?: string[];
    createdAt?: string;
    rating?: number;
    isActive?: boolean;
    vendorId?: {
        _id: string;
        name: string; // vendor's name
        rating?: number;
        businessName?: string;
    };
}

export interface Package {
    _id: string;
    // Canonical backend fields
    name?: string; // backend uses `name`
    description: string;
    price: number;
    location?: string | { city: string; district: string };
    packageIncludes?: string[]; // backend uses `packageIncludes`
    // Legacy/compat
    title?: string;
    services?: string[];
    images?: string[];
    vendorId?: {
        _id: string;
        name: string;
        rating?: number;
    };
    createdAt: string;
}

export interface VendorService extends Service {
    vendorId?: {
        _id: string;
        name: string;
        rating?: number;
    };
    isActive?: true;
}
