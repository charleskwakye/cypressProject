describe('Product Catalog Tests', () => {
  beforeEach(() => {
    cy.loginWithStorePassword();
    cy.acceptCookies();
    cy.navigateToCatalog();
  });

  it('should display products in the catalog', () => {
    // Check that product grid/slider exists and contains items
    cy.get('.product-grid, ul.grid').should('exist');
    
    // Verify products contain required elements
    cy.get('.card__heading').should('contain.text', 'coffee');
    cy.get('.price-item--regular').should('exist');
  });

  it('should sort products by price', () => {
    // Only run this test if we have at least 2 products
    cy.get('.price-item--regular').should('have.length.at.least', 2).then(() => {
      // Select price (low to high) from the sort dropdown
      cy.get('#SortBy').select('price-ascending');
      
      // Wait for page to update
      cy.wait(2000);
      
      // Get all prices and verify they're in ascending order
      cy.get('.price-item--regular').then($prices => {
        // Extract numeric values from prices
        const priceValues: number[] = [];
        
        $prices.each((_, el) => {
          const priceText = Cypress.$(el).text().trim();
          const priceMatch = priceText.match(/[0-9]+\.?[0-9]*/);
          
          if (priceMatch) {
            priceValues.push(parseFloat(priceMatch[0]));
          }
        });
        
        // Simple check that prices are in ascending order
        const isSorted = priceValues.every((price, i) => 
          i === 0 || price >= priceValues[i - 1]
        );
        
        expect(isSorted).to.be.true;
      });
    });
  });

  it('should sort products by price (high to low)', () => {
    cy.get('.price-item--regular').should('have.length.at.least', 2).then(() => {
      // Select price (high to low) from the sort dropdown
      cy.get('#SortBy').select('price-descending');
      
      // Wait for page to update
      cy.wait(2000);
      
      // Verify prices are in descending order
      cy.get('.price-item--regular').then($prices => {
        const priceValues: number[] = [];
        
        $prices.each((_, el) => {
          const priceText = Cypress.$(el).text().trim();
          const priceMatch = priceText.match(/[0-9]+\.?[0-9]*/);
          
          if (priceMatch) {
            priceValues.push(parseFloat(priceMatch[0]));
          }
        });
        
        // Check that prices are in descending order
        const isSorted = priceValues.every((price, i) => 
          i === 0 || price <= priceValues[i - 1]
        );
        
        expect(isSorted).to.be.true;
      });
    });
  });

  it('should sort products alphabetically (A-Z)', () => {
    cy.get('.card__heading').should('have.length.at.least', 2).then(() => {
      // Select alphabetical (A-Z) from the sort dropdown
      cy.get('#SortBy').select('title-ascending');
      
      // Wait for page to update
      cy.wait(2000);
      
      // Verify product titles are in alphabetical order
      cy.get('.card__heading').then($titles => {
        const titleTexts: string[] = [];
        
        $titles.each((_, el) => {
          titleTexts.push(Cypress.$(el).text().trim().toLowerCase());
        });
        
        // Check that titles are in ascending alphabetical order
        const isSorted = titleTexts.every((title, i) => 
          i === 0 || title >= titleTexts[i - 1]
        );
        
        expect(isSorted).to.be.true;
      });
    });
  });

  it('should sort products alphabetically (Z-A)', () => {
    cy.get('.card__heading').should('have.length.at.least', 2).then(() => {
      // Select alphabetical (Z-A) from the sort dropdown
      cy.get('#SortBy').select('title-descending');
      
      // Wait for page to update
      cy.wait(2000);
      
      // Verify product titles are in reverse alphabetical order
      cy.get('.card__heading').then($titles => {
        const titleTexts: string[] = [];
        
        $titles.each((_, el) => {
          titleTexts.push(Cypress.$(el).text().trim().toLowerCase());
        });
        
        // Check that titles are in descending alphabetical order
        const isSorted = titleTexts.every((title, i) => 
          i === 0 || title <= titleTexts[i - 1]
        );
        
        expect(isSorted).to.be.true;
      });
    });
  });

  it('should be able to select other sort options', () => {
    // Verify remaining sort options can be selected without errors
    const otherOptions = [
      'manual',            // Featured
      'best-selling',      // Best selling
      'created-ascending', // Date, old to new
      'created-descending' // Date, new to old
    ];
    
    otherOptions.forEach(option => {
      // Select the sort option
      cy.get('#SortBy').select(option);
      
      // Wait for page to update
      cy.wait(1000);
      
      // Verify the dropdown shows the correct value and page still has products
      cy.get('#SortBy').should('have.value', option);
      cy.get('.product-grid .grid__item, .grid .grid__item').should('exist');
    });
  });

  it('should navigate to product detail page correctly', () => {
    // Click on the first product card
    cy.get('.card-wrapper a, .product-grid .grid__item a').first().click({ force: true });
    
    // Verify we're on a product detail page
    cy.url().should('include', '/products/');
    
    // Check that product details are displayed
    cy.get('h1').should('exist');
    cy.get('.price').should('exist');
    cy.get('.product__description, .product-description').should('exist');
  });
});

describe('Product Detail Tests', () => {
  beforeEach(() => {
    cy.loginWithStorePassword();
    cy.acceptCookies();
    cy.navigateToCatalog();
    
    // Click on the first product
    cy.get('.card-wrapper a, .product-grid .grid__item a').first().click({ force: true });
  });

  it('should display correct product information', () => {
    // Verify product title exists
    cy.get('h1').should('contain.text', 'coffee');
    
    // Verify price exists
    cy.get('.price__regular .price-item, .price-item--regular').should('exist');
    
    // Verify product description exists
    cy.get('.product__description, .product-description').should('exist');
    
    // Verify product images exist
    cy.get('.product__media-item img, .product-media img, img').should('exist');
  });
}); 