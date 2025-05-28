describe('End-to-End User Journey', { testIsolation: false }, function () {
  //can you wite a little code to reset, sessions, cookies, etc.
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.reload();
  });

  it('1. Login and accept cookies', function () {
    cy.loginWithStorePassword();
    cy.acceptCookies();
  });

  it('2. Navigate to About page', function () {
    // Navigate to the About page using the custom command
    cy.navigateToAbout();

    // Check that the page has the correct title
    cy.get('.main-page-title').should('contain.text', 'About');

    // Check for expected content
    cy.get('.rte > p').should('exist');
    cy.get('.rte').should('contain.text', 'RealBeans');
  });

  it('3. Navigate to Catalog page', function () {
    // Navigate to Catalog page using the custom command
    cy.navigateToCatalog();

    // Verify we're on the catalog page
    cy.url().should('include', '/collections');

    // Check products are displayed
    cy.get('.product-grid').should('exist');
    cy.get('.card').should('have.length.at.least', 1);

    // Check product images exist with correct filenames
    cy.get('.card__media img[alt="Blended coffee 5kg"]')
      .should('exist')
      .and('have.attr', 'src')
      .and('include', 'RealBeansBlendBag.png');

    cy.get('.card__media img[alt="Roasted coffee beans 5kg"]')
      .should('exist')
      .and('have.attr', 'src')
      .and('include', 'RealBeansRoastedBag.png');
  });

  it('4. Navigate to Blended Coffee product page', function () {
    // Find and click on Blended Coffee product
    cy.get('.card__heading a')
      .contains('Blended coffee', { matchCase: false })
      .click({ force: true });

    // Verify we're on the correct product page
    cy.url().should('include', '/products/blended-coffee-5kg');
    cy.get('h1').should('contain.text', 'Blended coffee 5kg');

    // Verify product description
    cy.get('.product__description').should('contain.text', 'RealBeans coffee');

    // Verify product image exists with correct filename
    cy.get('.product__media-item img')
      .should('exist')
      .and('have.attr', 'src')
      .and('include', 'RealBeansBlendBag.png');
  });

  it('5. Verify variants and prices', function () {
    // Verify initial variant and price
    cy.get('input[value="Robusta"]').should('be.checked');
    cy.get('.price-item--regular').first().should('contain.text', '€55');

    // Verify all variant options are present
    const expectedVariants = ['Robusta', 'Excelsa', 'Arabica', 'Liberica'];
    expectedVariants.forEach(variant => {
      cy.get(`input[value="${variant}"]`).should('exist');
    });

    // Select different variant (Liberica)
    cy.get('input[value="Liberica"]').check({ force: true });
    cy.wait(1000);

    // Verify price updated
    cy.get('.price-item--regular').first().should('contain.text', '€65');
  });

  it('6. Test quantity validation', function () {
    // Try to add excessive quantity (more than available)
    cy.get('input.quantity__input')
      .clear({ force: true })
      .type('30', { force: true });

    // Click Add to Cart
    cy.get('button[name="add"]').click({ force: true });

    // Should show error about quantity
    cy.wait(2000);
    cy.get('.product-form__error-message-wrapper')
      .should('be.visible')
      .find('.product-form__error-message')
      .should('contain.text', 'Only 25 items were added to your cart');

    // Close cart notification if it appeared
    cy.get('body').then($body => {
      if ($body.find('#cart-notification.active').length > 0) {
        cy.contains('button', 'Continue shopping').click();
        cy.wait(1000);
      }
    });
  });

  it('7. Add product to cart', function () {
    // Switch to Robusta variant
    cy.get('input[value="Robusta"]').check({ force: true });
    cy.wait(1000);

    // Verify price updated for Robusta
    cy.get('.price-item--regular').first().should('contain.text', '€55');

    // Set a valid quantity
    cy.get('input.quantity__input')
      .clear({ force: true })
      .type('5', { force: true });

    // Click Add to Cart
    cy.get('button[name="add"]').click({ force: true });

    // Wait for cart notification
    cy.wait(3000);

    // Check for cart notification content
    cy.get('#cart-notification-product', { timeout: 10000 })
      .should('exist')
      .should('contain.text', 'Blended coffee 5kg');

    // Check cart notification image
    cy.get('#cart-notification-product img')
      .should('exist')
      .and('have.attr', 'src')
      .and('include', 'RealBeansBlendBag.png');
  });


  it('8. Compare with Roasted Coffee product', function () {
    // Navigate back to catalog
    cy.navigateToCatalog();

    // Click on Roasted Coffee product
    cy.get('.card__heading a')
      .contains('Roasted coffee beans', { matchCase: false })
      .click({ force: true });

    // Verify we're on the product page
    cy.url().should('include', '/products/roasted-coffee-beans-5kg');

    // Verify product title
    cy.get('h1').should('contain.text', 'Roasted coffee beans 5kg');

    // Verify base price (for default variant - Robusta)
    cy.get('.price-item--regular').first().should('contain.text', '€40');

    // Verify product image exists with correct filename
    cy.get('.product__media-item img')
      .should('exist')
      .and('have.attr', 'src')
      .and('include', 'RealBeansRoastedBag.png');
  });

  it('9. Navigate to cart and verify contents', function () {
    // Find and click the View Cart button
    cy.get('#cart-notification-button, [data-test="view-cart"], a[href="/cart"]')
      .should('exist')
      .first()
      .click();

    // Verify we're on the cart page
    cy.url().should('include', '/cart');

    // Verify product is in cart with correct variant and quantity
    cy.get('.cart-item')
      .should('contain.text', 'Blended coffee 5kg')
      .should('contain.text', 'Robusta')
      .find('input.quantity__input')
      .should('have.value', '5');
  });
}); 