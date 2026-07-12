# Diamas Core Dashboard - Setup Complete

## Overview
Diamas Core is a customer analytics dashboard with three main pages for tracking customer popup interactions.

## Pages Implemented

### 1. Main Dashboard (`/`)
- **Location**: `src/app/(admin)/page.tsx`
- **Features**:
  - Customer metrics cards (Total Customers, Active Customers)
  - Recent customers list (shows 6 customers with clickable links)
  - Monthly sales chart
  - Statistics chart
- **Navigation**: Click any customer to view their details, or "View All" to see all customers

### 2. Customers Page (`/customers`)
- **Location**: `src/app/(admin)/customers/page.tsx`
- **Features**:
  - Complete table of all customers
  - Columns: User (with avatar), Email, Platform, Status, Registration Date, Actions
  - Filter button (UI placeholder)
  - View button for each customer
- **Navigation**: Click "View" or customer name to see individual customer page

### 3. Individual Customer Page (`/customers/[id]`)
- **Location**: `src/app/(admin)/customers/[id]/page.tsx`
- **Features**:
  - Customer information card with avatar, name, email, status, platform
  - Customer ID, registration date, total interactions
  - **Analytics Chart** showing:
    - Popup Opens
    - Popup Closes
    - Success count
    - Rejection count
  - Bar chart visualization
  - Individual stat cards with color coding
  - Success rate and rejection rate calculations
  - Back to Customers button

## Data Structure

### Customer Data (`src/data/customers.ts`)
- 15 dummy customers with realistic data
- Platforms: Web, Mobile, Desktop
- Statuses: Active, Inactive, Pending
- Each customer has popup statistics:
  - `opens`: Number of times popup was opened
  - `closes`: Number of times popup was closed
  - `success`: Number of successful interactions
  - `rejection`: Number of rejections

## Components Created

### 1. CustomerMetrics (`src/components/customers/CustomerMetrics.tsx`)
- Displays total and active customer counts
- Shows growth percentage badges

### 2. CustomerList (`src/components/customers/CustomerList.tsx`)
- Shows recent customers on dashboard
- Clickable cards linking to individual customer pages
- "View All" button to customers page

### 3. CustomerTable (`src/components/customers/CustomerTable.tsx`)
- Full table view of all customers
- Sortable columns
- View action button for each customer

### 4. CustomerAnalyticsChart (`src/components/customers/CustomerAnalyticsChart.tsx`)
- Bar chart showing popup analytics
- Color-coded stat cards
- Success and rejection rate calculations
- Uses ApexCharts for visualization

## Navigation Flow

```
Dashboard (/)
    ├─> Click customer → Individual Customer (/customers/:id)
    └─> Click "View All" → Customers Page (/customers)
            └─> Click customer → Individual Customer (/customers/:id)
```

## Sidebar Navigation

Simplified to show only:
- **Dashboard** - Main dashboard page
- **Customers** - All customers page

## Running the Application

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Dashboard: http://localhost:3000/
   - Customers: http://localhost:3000/customers
   - Individual Customer: http://localhost:3000/customers/1 (IDs: 1-15)

## Key Features

✅ Responsive design with dark mode support
✅ Real-time navigation between pages
✅ Dynamic routing for individual customers
✅ Interactive charts with ApexCharts
✅ Clean, modern UI with Tailwind CSS
✅ TypeScript for type safety
✅ 15 customers with realistic dummy data

## Notes

- Customer IDs range from 1 to 15
- All customer data is stored in `src/data/customers.ts`
- Charts use ApexCharts library (already included in dependencies)
- The app uses Next.js 15 App Router with async params
