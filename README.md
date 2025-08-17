# Angular E-commerce Garvez

# Overview
<img width="1901" height="862" alt="Screenshot 2025-08-17 234632" src="https://github.com/user-attachments/assets/a2a2efc3-c3e0-4e57-ad6d-1221bf92adbb" />

A simplified e-commerce cart application built with Angular that demonstrates proficiency in JavaScript (ES6+), DOM manipulation, API integration, modular code structure, and unit testing.

# Features Implemented

# 1. Product Listing
- Fetches products from a mock API service
- Displays product name, image, price
- Quantity input field for each product
- "Add to Cart" button functionality

# 2. Cart Functionality
- Add items to cart with specified quantity
- Automatic quantity increment for existing items
- Cart summary showing:
  - Product details (name, image, quantity)
  - Individual item totals
  - Grand total calculation
- Coupon system with "SAVE10" code
  - Applies to items $100 and above
  - Maximum $50 discount per eligible item

# 3. Cart Persistence
- Cart data persists across page reloads using localStorage
- Automatic cart restoration on app initialization

# 4. Code Quality
- Modern Angular with TypeScript
- Modular service-based architecture
- Reactive programming with RxJS
- Clean, readable, and testable code structure
- Separation of concerns with services and components

## Setup Instructions
# Prerequisites
- Node.js (v16 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Installation
1. Clone or extract the project files
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
```bash
ng serve
```
Navigate to `http://localhost:4200/`


## Assumptions Made
1. Product data is served from a mock service (no real backend)
2. Cart persistence uses localStorage 
3. Coupon "SAVE10" is the only implemented coupon code
4. Currency is displayed in USD format
5. No user authentication required
6. No checkout/payment flow implementation needed


## Time Spent
Approximately 24 hours

## Future Enhancements
- Add product search and filtering
- Implement multiple coupon types
- Add product categories
- Enhanced error handling
- Backend API integration
- User authentication
- Order history
