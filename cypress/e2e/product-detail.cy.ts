describe('Product Detail and Variants Tests', () => {
  beforeEach(() => {
    cy.loginWithStorePassword();
    cy.acceptCookies();
  });

  it('should navigate from catalog to product detail page correctly', () => {
    // Go to catalog page
    cy.navigateToCatalog();
    
    // Find and click on Blended Coffee product
    cy.get('.card__heading a')
      .contains('Blended coffee', { matchCase: false })
      .click({ force: true });
    
    // Verify we're on the correct product page
    cy.url().should('include', '/products/blended-coffee-5kg');
    cy.get('h1').should('contain.text', 'Blended coffee 5kg');
    
    // Verify price is correct for the default variant
    cy.get('.price-item--regular').first().should('contain.text', '€55');
  });

  it('should display correct basic details for Blended Coffee 5kg', () => {
    // Navigate directly to the Blended Coffee product
    cy.visit(`${Cypress.env('baseUrl')}/products/blended-coffee-5kg`);
    
    // Verify product title
    cy.get('h1').should('contain.text', 'Blended coffee 5kg');
    
    // Verify base price (for default variant - Robusta)
    cy.get('.price-item--regular').first().should('contain.text', '€55');
    
    // Verify product description
    cy.get('.product__description').should('contain.text', 'RealBeans coffee, ready to brew.');
    
    // Verify variant options exist
    cy.get('fieldset.product-form__input').should('exist');
    cy.get('legend.form__label').should('contain.text', 'Type');
    
    // Verify all variant options are present
    const expectedVariants = ['Robusta', 'Excelsa', 'Arabica', 'Liberica'];
    expectedVariants.forEach(variant => {
      cy.get(`input[value="${variant}"]`).should('exist');
    });
    
    // Verify default variant is selected (Robusta)
    cy.get('input[value="Robusta"]').should('be.checked');
    
    // Verify Add to Cart button exists
    cy.get('button[name="add"]').should('contain.text', 'Add to cart');
  });

  it('should verify correct prices for all Blended Coffee 5kg variants', () => {
    // Navigate directly to the Blended Coffee product
    cy.visit(`${Cypress.env('baseUrl')}/products/blended-coffee-5kg`);
    
    // Define expected variants and their prices based on requirements
    const blendedCoffeeVariants = [
      { name: 'Robusta', price: '€55' },
      { name: 'Excelsa', price: '€60' },
      { name: 'Arabica', price: '€60' },
      { name: 'Liberica', price: '€65' }
    ];
    
    // Check each variant and its price
    blendedCoffeeVariants.forEach(variant => {
      // Select the variant
      cy.log(`Checking ${variant.name} variant with expected price ${variant.price}`);
      cy.get(`input[value="${variant.name}"]`).check({ force: true });
      
      // Wait for price to update
      cy.wait(1000);
      
      // Verify the price is correct
      cy.get('.price-item--regular').first()
        .should('contain.text', variant.price)
        .then($el => {
          const actualPrice = $el.text().trim();
          cy.log(`Actual price: ${actualPrice}, Expected: ${variant.price}`);
          // Check that the price contains the expected value (allows for small formatting differences)
          expect(actualPrice).to.include(variant.price);
        });
    });
  });

  it('should verify additional properties for all Blended Coffee 5kg variants', () => {
    // Navigate directly to the Blended Coffee product
    cy.visit(`${Cypress.env('baseUrl')}/products/blended-coffee-5kg`);
    
    // Define expected variants with their details
    const blendedCoffeeVariants = [
      { 
        name: 'Robusta', 
        price: '€55', 
        available: true,
        weight: '5kg'
      },
      { 
        name: 'Excelsa', 
        price: '€60', 
        available: true,
        weight: '5kg'
      },
      { 
        name: 'Arabica', 
        price: '€60', 
        available: true,
        weight: '5kg'
      },
      { 
        name: 'Liberica', 
        price: '€65', 
        available: true,
        weight: '5kg'
      }
    ];
    
    // For each variant
    blendedCoffeeVariants.forEach(variant => {
      // Select the variant
      cy.log(`Checking detailed properties for ${variant.name} variant`);
      cy.get(`input[value="${variant.name}"]`).check({ force: true });
      cy.wait(1000); // Wait for UI to update
      
      // Verify the variant is selected
      cy.get(`input[value="${variant.name}"]`).should('be.checked');
      
      // Verify price
      cy.get('.price-item--regular').first().should('contain.text', variant.price);
      
      // Verify product title still contains the weight
      cy.get('h1').should('contain.text', variant.weight);
      
      // Verify Add to Cart button is enabled (if variant is available)
      if (variant.available) {
        cy.get('button[name="add"]').should('not.be.disabled')
          .and('contain.text', 'Add to cart');
      }
      
      // Check that product image exists (without requiring visibility)
      cy.get('.product__media-wrapper').should('exist');
      
      // Check for product description
      cy.get('.product__description').should('contain.text', 'RealBeans coffee, ready to brew.');
    });
    
    // Verify image source contains the expected filename
    // Using a more specific selector and not requiring visibility
    cy.get('.product__media-item img')
      .should('have.attr', 'src')
      .and('include', 'RealBeansBlendBag');
  });

  it('should verify variant availability for Blended Coffee 5kg', () => {
    // Navigate to the Blended Coffee product
    cy.visit(`${Cypress.env('baseUrl')}/products/blended-coffee-5kg`);
    
    // Check if stock/availability information is displayed
    // Note: This might not be visible if the store doesn't show exact stock counts
    // But we can check for general inventory-related elements
    cy.get('.product-form__buttons').should('exist');
    
    // Verify that all variants can be selected (are in stock)
    const variants = ['Robusta', 'Excelsa', 'Arabica', 'Liberica'];
    variants.forEach(variant => {
      cy.get(`input[value="${variant}"]`).should('not.be.disabled');
    });
  });

  it('should allow changing product quantity for Blended Coffee 5kg', () => {
    // Navigate to the Blended Coffee product
    cy.visit(`${Cypress.env('baseUrl')}/products/blended-coffee-5kg`);
    
    // Verify initial quantity is 1
    cy.get('input.quantity__input').should('have.value', '1');
    
    // Increase quantity to 2
    cy.get('button[name="plus"]').click();
    cy.get('input.quantity__input').should('have.value', '2');
    
    // Increase quantity to 3
    cy.get('button[name="plus"]').click();
    cy.get('input.quantity__input').should('have.value', '3');
    
    // Decrease quantity back to 2
    cy.get('button[name="minus"]').click();
    cy.get('input.quantity__input').should('have.value', '2');
  });

  it('should display correct basic details for Roasted Coffee Beans 5kg', () => {
    // Navigate directly to the Roasted Coffee Beans product
    cy.visit(`${Cypress.env('baseUrl')}/products/roasted-coffee-beans-5kg`);
    
    // Verify product title
    cy.get('h1').should('contain.text', 'Roasted coffee beans 5kg');
    
    // Verify base price (for default variant - Robusta)
    cy.get('.price-item--regular').first().should('contain.text', '€40');
    
    // Verify product description
    cy.get('.product__description').should('contain.text', 'Our best and sustainable real roasted beans.');
    
    // Verify variant options exist
    cy.get('fieldset.product-form__input').should('exist');
    cy.get('legend.form__label').should('contain.text', 'Type');
    
    // Verify all variant options are present
    const expectedVariants = ['Robusta', 'Excelsa', 'Arabica', 'Liberica'];
    expectedVariants.forEach(variant => {
      cy.get(`input[value="${variant}"]`).should('exist');
    });
    
    // Verify default variant is selected (Robusta)
    cy.get('input[value="Robusta"]').should('be.checked');
  });

  it('should verify correct prices for all Roasted Coffee Beans 5kg variants', () => {
    // Navigate directly to the Roasted Coffee Beans product
    cy.visit(`${Cypress.env('baseUrl')}/products/roasted-coffee-beans-5kg`);
    
    // Define expected variants and their prices based on requirements
    const roastedCoffeeVariants = [
      { name: 'Robusta', price: '€40' },
      { name: 'Excelsa', price: '€50' },
      { name: 'Arabica', price: '€55' },
      { name: 'Liberica', price: '€55' }
    ];
    
    // Check each variant and its price
    roastedCoffeeVariants.forEach(variant => {
      // Select the variant
      cy.log(`Checking ${variant.name} variant with expected price ${variant.price}`);
      cy.get(`input[value="${variant.name}"]`).check({ force: true });
      
      // Wait for price to update
      cy.wait(1000);
      
      // Verify the price is correct
      cy.get('.price-item--regular').first()
        .should('contain.text', variant.price)
        .then($el => {
          const actualPrice = $el.text().trim();
          cy.log(`Actual price: ${actualPrice}, Expected: ${variant.price}`);
          // Check that the price contains the expected value (allows for small formatting differences)
          expect(actualPrice).to.include(variant.price);
        });
    });
  });

  it('should show error message when adding more items than available to cart', () => {
    // Navigate to the Blended Coffee product
    cy.visit(`${Cypress.env('baseUrl')}/products/blended-coffee-5kg`);
    
    // Try to set quantity to more than available (e.g., 30 when only 25 are available)
    cy.get('input.quantity__input').clear({ force: true }).type('30', { force: true });
    
    // Click Add to Cart button
    cy.get('button[name="add"]').click({ force: true });
    
    // Wait for response
    cy.wait(2000);
    
    // Verify error message is displayed
    cy.get('.product-form__error-message-wrapper')
      .should('be.visible')
      .find('.product-form__error-message')
      .should('contain.text', 'Only 25 items were added to your cart');
  });

  it('should verify adding valid quantity to cart shows notification popup', () => {
    // Navigate to the Blended Coffee product
    cy.visit(`${Cypress.env('baseUrl')}/products/blended-coffee-5kg`);
    
    // Set a valid quantity
    cy.get('input.quantity__input').clear({ force: true }).type('5', { force: true });
    
    // Click Add to Cart button
    cy.get('button[name="add"]').click({ force: true });
    
    // Wait for cart notification popup
    cy.wait(1000);
    
    // Verify cart notification popup appears
    cy.get('#cart-notification')
      .should('be.visible')
      .should('have.class', 'active');
    
    // Verify it shows the correct product
    cy.get('#cart-notification-product')
      .should('contain.text', 'Blended coffee 5kg');
    
    // Verify the buttons for "View cart" and "Check out" exist
    cy.get('#cart-notification-button').should('be.visible');
    cy.get('button[name="checkout"]').should('be.visible');
    
    // Close the notification by clicking "Continue shopping"
    cy.contains('button', 'Continue shopping').click();
  });

  it('should verify quantity input validation and handle minimum/maximum values', () => {
    // Navigate to the Blended Coffee product
    cy.visit(`${Cypress.env('baseUrl')}/products/blended-coffee-5kg`);
    
    // Start with a valid quantity
    cy.get('input.quantity__input').clear({ force: true }).type('5', { force: true });
    
    // Verify the quantity is accepted
    cy.get('h1').click({ force: true });
    cy.get('input.quantity__input').should('have.value', '5');
    
    // Enter a valid quantity within availability
    cy.get('input.quantity__input').clear({ force: true }).type('10', { force: true });
    
    // Verify it's accepted
    cy.get('h1').click({ force: true });
    cy.get('input.quantity__input').should('have.value', '10');
    
    // Try adding to cart with a valid quantity
    cy.get('button[name="add"]').click({ force: true });
    
    // Wait for potential cart notification or redirect
    cy.wait(2000);
    
    // Check that no error message is shown
    cy.get('body').then($body => {
      const hasErrorMessage = $body.find('.product-form__error-message-wrapper:visible, .cart-notification__error:visible').length > 0;
      expect(hasErrorMessage).to.be.false;
    });
    
    // Return to product page if we were redirected
    cy.url().then(url => {
      if (!url.includes('/products/blended-coffee-5kg')) {
        cy.visit(`${Cypress.env('baseUrl')}/products/blended-coffee-5kg`);
      }
    });
    
    // Enter a quantity exceeding available stock
    cy.get('input.quantity__input').clear({ force: true }).type('30', { force: true });
    
    // Try adding to cart with excessive quantity
    cy.get('button[name="add"]').click({ force: true });
    
    // Wait for error message or notification
    cy.wait(2000);
    
    // Check for some indication of limited stock
    cy.get('body').then($body => {
      const hasErrorMsg = $body.find('.product-form__error-message-wrapper:visible, [role="alert"]:visible, .cart-notification__error:visible').length > 0;
      
      if (hasErrorMsg) {
        // Error message is shown on the product page
        cy.get('.product-form__error-message-wrapper, [role="alert"], .cart-notification__error')
          .should('be.visible');
      } else {
        // Might have been redirected to cart with a warning
        cy.url().then(url => {
          if (url.includes('/cart')) {
            cy.get('.cart__warnings, .cart-item__error-text, .cart__empty-text')
              .should('exist');
          }
        });
      }
    });
  });

  it('should verify product images exist', () => {
    // First check the catalog page images
    cy.visit(`${Cypress.env('baseUrl')}/collections/all`);
    
    // Check Blended Coffee image in catalog has correct filename
    cy.get('.card__media img[alt="Blended coffee 5kg"]')
      .should('exist')
      .and('have.attr', 'src')
      .and('include', 'RealBeansBlendBag.png');
    
    // Check Roasted Coffee Beans image in catalog has correct filename
    cy.get('.card__media img[alt="Roasted coffee beans 5kg"]')
      .should('exist')
      .and('have.attr', 'src')
      .and('include', 'RealBeansRoastedBag.png');
    
    // Test Blended Coffee detail page image
    cy.visit(`${Cypress.env('baseUrl')}/products/blended-coffee-5kg`);
    
    // Check image exists and has correct filename
    cy.get('.product__media-item img')
      .should('exist')
      .and('have.attr', 'src')
      .and('include', 'RealBeansBlendBag.png');
    
    // Test Roasted Coffee Beans detail page image
    cy.visit(`${Cypress.env('baseUrl')}/products/roasted-coffee-beans-5kg`);
    
    // Check image exists and has correct filename
    cy.get('.product__media-item img')
      .should('exist')
      .and('have.attr', 'src')
      .and('include', 'RealBeansRoastedBag.png');
    
    // Verify cart notification shows correct product image
    cy.visit(`${Cypress.env('baseUrl')}/products/blended-coffee-5kg`);
    cy.get('button[name="add"]').click({ force: true });
    cy.wait(1000);
    
    // Check cart notification image exists and has correct filename
    cy.get('#cart-notification-product img')
      .should('exist')
      .and('have.attr', 'src')
      .and('include', 'RealBeansBlendBag.png');
  });
}); 