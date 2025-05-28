//get url from env and password from env, visit url and use password to login

describe('Homepage', () => {
  // Login and accept cookies only once before all tests
  beforeEach(() => {
    cy.loginWithStorePassword();
    cy.acceptCookies();
  });


  it('should display the intro text correctly', () => {
    // Check for rich text wrapper and emphasized text
    cy.get('.rich-text__wrapper').should('exist');
    
    // Verify the emphasized text contains key phrases
    cy.get('.rich-text__wrapper em')
      .should('contain.text', 'Since 1801')
      .should('contain.text', 'RealBeans')
      .should('contain.text', 'Antwerp')
      .should('contain.text', 'Europe')
      .should('contain.text', 'Ethically sourced beans');
  });

  it('should verify homepage banner', () => {
    
    // Check banner content exists
    cy.get('.banner__content').should('exist');
    
    // Verify banner image exists
    cy.get('.banner__media img').should('exist');
    
    // Verify banner has some content like buttons or text
    cy.get('.banner__content')
      .should('exist');
  });

  it('should display featured products', () => {
    // Check product slider exists
    cy.get('slider-component').should('exist');
    
    // Check for product cards
    cy.get('li[id^="Slide-"]').should('have.length.at.least', 1);
    
    // Verify card components have required information
    cy.get('.card__heading').should('contain.text', 'coffee');
    
    // Check for prices
    cy.get('.price-item--regular').should('exist');
    
    // Verify product links work by clicking a visible product link
    cy.get('li[id^="Slide-"]').first().within(() => {
      cy.get('a:visible').first().click({ force: true });
    });
    
    // Verify we've navigated to a product page
    cy.url().should('include', '/products/');
    
    // Go back to homepage
    cy.go('back');
  });

  it('should navigate to catalog page when clicking Shop All button', () => {
    // Check that the Shop All button exists
    cy.get('.rich-text__buttons > .button').should('exist');
    
    // Verify button text (using lowercase 'all' to match actual text)
    cy.get('.rich-text__buttons > .button').should('contain.text', 'Shop all');
    
    // Click the Shop All button
    cy.get('.rich-text__buttons > .button').click();
    
    // Verify we've navigated to the catalog/collections page
    cy.url().should('include', '/collections');
    
    // Verify products are displayed on the collections page
    cy.get('li[id^="Slide-"], .product-grid').should('exist');
    
    // Go back to homepage
    cy.go('back');
  });

  it('should have working navigation', () => {
    // Test navigation to collections/catalog page
    cy.get('#HeaderMenu-catalog > span').click({ force: true });
    cy.url().should('include', '/collections');
    
    // Go back to homepage
    cy.visit(Cypress.env('baseUrl'));
    
    // Test navigation to About page
    cy.get('#HeaderMenu-about-us > span').click({ force: true });
    
    // Verify About page content
    cy.get('.main-page-title').should('contain.text', 'About');
    cy.get('.rte > p').should('exist');
    
    // Go back to homepage
    cy.visit(Cypress.env('baseUrl'));
    
    // Check if logo exists and is clickable
    cy.get('.header__heading-link').should('exist');
  });

 
});

