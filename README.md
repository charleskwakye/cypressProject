# RealBeans Coffee Shop Testing Project

This repository contains Cypress tests for the RealBeans coffee shop Shopify store. The tests verify functionality including:

- Homepage content and navigation
- Product details and variants
- Shopping cart functionality
- User journeys (end-to-end tests)

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repository-url>
cd realbeans-project

# Install dependencies
npm install
```

### Running the tests
```bash
# Open Cypress Test Runner
npm run cypress:open

# Run tests headlessly
npm run cypress:run
```

## Test Structure

- `cypress/e2e/homepage.cy.ts` - Tests for homepage functionality
- `cypress/e2e/product-detail.cy.ts` - Tests for product detail pages
- `cypress/e2e/cart.cy.ts` - Tests for shopping cart functionality

## Custom Commands

The project uses several custom commands defined in `cypress/support/commands.js` including:
- `loginWithStorePassword()` - Handles store password protection
- `acceptCookies()` - Handles cookie consent
- `navigateToCatalog()` - Navigates to product catalog
- `navigateToAbout()` - Navigates to About page 