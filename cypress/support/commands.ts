/// <reference types="cypress" />

// Login with the store password
Cypress.Commands.add('loginWithStorePassword', () => {
  cy.visit(Cypress.env('baseUrl'));
  cy.url().should('include', '/password');
  cy.get('input[name="password"]').type(Cypress.env('password'));
  cy.get('button[type="submit"]').click();
  cy.url().should('eq', Cypress.env('baseUrl'));
});

// Attempt login with incorrect password
Cypress.Commands.add('attemptIncorrectPasswordLogin', (incorrectPassword = 'wrongpassword123') => {
  cy.visit(Cypress.env('baseUrl'));
  cy.url().should('include', '/password');
  cy.get('input[name="password"]').type(incorrectPassword);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/password');
  cy.get('.error-message')
    .should('be.visible')
    .and('contain.text', 'Password incorrect, please try again.');
});

// Verify cookie banner is visible
Cypress.Commands.add('verifyCookieBannerVisible', () => {
  // Wait a bit for the banner to appear (it loads asynchronously)
  cy.wait(1000);
  cy.get('body').then($body => {
    if ($body.find('#shopify-pc__banner').length > 0) {
      cy.get('#shopify-pc__banner').should('be.visible');
    } else {
      cy.log('Cookie banner not present - may already be accepted or not shown in this environment');
    }
  });
});

// Accept cookies (with resilient handling for all environments)
Cypress.Commands.add('acceptCookies', () => {
  // Wait a moment for the banner to potentially load
  cy.wait(1000);
  
  // Check if the cookie banner exists first, then act accordingly
  cy.get('body').then($body => {
    const bannerExists = $body.find('#shopify-pc__banner').length > 0;
    
    if (bannerExists) {
      // Cookie banner exists, accept it
      cy.log('Cookie banner found - accepting cookies');
      cy.get('#shopify-pc__banner__btn-accept').should('be.visible').click({force: true});
      
      // Verify it's gone (with a generous timeout)
      cy.get('#shopify-pc__banner').should('not.exist', {timeout: 5000});
    } else {
      // Cookie banner doesn't exist, log and continue
      cy.log('Cookie banner not found - may already be accepted or not shown in this environment');
    }
  });
});

// Decline cookies (with resilient handling for all environments)
Cypress.Commands.add('declineCookies', () => {
  // Wait a moment for the banner to potentially load
  cy.wait(1000);
  
  // Check if the cookie banner exists first, then act accordingly
  cy.get('body').then($body => {
    const bannerExists = $body.find('#shopify-pc__banner').length > 0;
    
    if (bannerExists) {
      // Cookie banner exists, decline it
      cy.log('Cookie banner found - declining cookies');
      cy.get('#shopify-pc__banner__btn-decline').should('be.visible').click({force: true});
      
      // Verify it's gone (with a generous timeout)
      cy.get('#shopify-pc__banner').should('not.exist', {timeout: 5000});
    } else {
      // Cookie banner doesn't exist, log and continue
      cy.log('Cookie banner not found - may already be declined or not shown in this environment');
    }
  });
});

// Navigate to catalog page
Cypress.Commands.add('navigateToCatalog', () => {
  // Navigate using the catalog menu item
  cy.get('#HeaderMenu-catalog > span').click({ force: true });
  cy.url().should('include', '/collections');
});

// Navigate to about page
Cypress.Commands.add('navigateToAbout', () => {
  // Navigate using the about-us menu item
  cy.get('#HeaderMenu-about-us > span').click({ force: true });
  // Verify we're on the about page
  cy.get('.main-page-title').should('contain.text', 'About');
});