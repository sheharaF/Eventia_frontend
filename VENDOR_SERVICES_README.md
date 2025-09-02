# Vendor Service Posting System

This document describes the implementation of the vendor service posting functionality in the Eventia application.

## Overview

The vendor service posting system allows vendors to:

- Post individual services (photography, catering, decoration, etc.)
- Create service packages with multiple offerings
- Manage their service listings from a dedicated dashboard
- View all services in a marketplace-style interface

## Features

### 1. Vendor Dashboard (`/vendor/dashboard`)

- **Overview Tab**: Shows statistics (earnings, bookings, services, packages)
- **Services Tab**: Lists all vendor services with management options
- **Bookings Tab**: Shows incoming bookings
- **Settings Tab**: Business profile management (TODO)

### 2. Service Posting (`/post-service`)

- **Service Creation**: Post individual services with details
- **Package Creation**: Create bundled service packages
- **Image Upload**: Support for service/package images
- **Form Validation**: Required field validation and error handling

### 3. Services Marketplace (`/services`)

- **Service Browsing**: View all vendor services and packages
- **Search & Filtering**: Search by name/description, filter by type and price
- **Service Details**: View comprehensive service information
- **Contact & Booking**: Direct vendor contact and booking options

## User Flow

### For Vendors:

1. **Login** → Access vendor dashboard
2. **Post Service** → Use "Post New Service" button or header "Post Service" button
3. **Fill Form** → Complete service/package details
4. **Submit** → Service appears in marketplace
5. **Manage** → Edit/delete services from dashboard

### For Customers:

1. **Browse Services** → Visit `/services` page
2. **Search & Filter** → Find specific services or packages
3. **View Details** → See service information, pricing, vendor details
4. **Contact/Book** → Reach out to vendors or book services

## API Endpoints

### Services

- `GET /api/ads` - Fetch all services
- `POST /api/ads` - Create new service
- `DELETE /api/vendor/services/:id` - Delete vendor service

### Packages

- `GET /api/packages` - Fetch all packages
- `POST /api/packages` - Create new package

### Vendor Dashboard

- `GET /api/vendor/dashboard` - Fetch vendor statistics
- `GET /api/vendor/services` - Fetch vendor's services
- `GET /api/vendor/bookings` - Fetch vendor's bookings

## File Structure

```
src/
├── pages/
│   ├── VendorDashboard.tsx      # Vendor dashboard with tabs
│   ├── VendorPostService.tsx    # Service/package posting form
│   └── Service.tsx              # Services marketplace
├── components/
│   └── Header.tsx               # Navigation with Post Service button
├── types/
│   └── services.ts              # Type definitions
└── api/
    └── axios.ts                 # API configuration
```

## Key Components

### VendorDashboard

- Tabbed interface for different dashboard sections
- Service management with edit/delete capabilities
- Quick access to post new services
- Statistics overview

### VendorPostService

- Tabbed form for services vs packages
- File upload for images
- Form validation and error handling
- Success feedback and navigation

### Service Page

- Marketplace view of all services
- Search and filtering capabilities
- Service cards with detailed information
- Contact and booking buttons

## Styling

The system uses:

- **shadcn/ui** components for consistent design
- **Tailwind CSS** for responsive layouts
- **Lucide React** icons for visual elements
- **Toast notifications** for user feedback

## Security

- **Protected Routes**: Service posting requires vendor authentication
- **Role-based Access**: Only vendors can access posting functionality
- **Token-based Auth**: JWT tokens for API requests

## Future Enhancements

- [ ] Service editing functionality
- [ ] Service status management (active/inactive)
- [ ] Advanced filtering (location, availability, etc.)
- [ ] Vendor ratings and reviews
- [ ] Service booking system
- [ ] Payment integration
- [ ] Service analytics and insights

## Usage Examples

### Posting a Service

```typescript
// Navigate to post service page
navigate("/post-service");

// Fill out service form
// - Service name
// - Service type (photography, catering, etc.)
// - Description
// - Price
// - Location
// - Upload image (optional)

// Submit form
// Service appears in marketplace
```

### Viewing Services

```typescript
// Navigate to services page
navigate("/services");

// Use search and filters
// - Search by name/description
// - Filter by service type
// - Filter by price range

// View service details
// Contact vendor or book service
```

## Troubleshooting

### Common Issues:

1. **Form not submitting**: Check required fields and API connectivity
2. **Images not uploading**: Verify file type and size
3. **Services not appearing**: Check API endpoints and authentication
4. **Dashboard not loading**: Verify vendor role and token validity

### Debug Steps:

1. Check browser console for errors
2. Verify API endpoints are accessible
3. Confirm user has vendor role
4. Check authentication token validity
5. Verify form data format

## Testing

To test the system:

1. Create a vendor account
2. Login and access vendor dashboard
3. Post a test service
4. View the service in the marketplace
5. Test search and filtering
6. Verify service management from dashboard

## Dependencies

- React Router for navigation
- Axios for API requests
- shadcn/ui for UI components
- Tailwind CSS for styling
- Lucide React for icons
