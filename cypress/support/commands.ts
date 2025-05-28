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
  cy.get('#shopify-pc__banner').should('be.visible');
});

// Accept cookies (with resilient handling for CI environments)
Cypress.Commands.add('acceptCookies', () => {
  // Check if the cookie banner exists first, then act accordingly
  cy.get('body').then($body => {
    if ($body.find('#shopify-pc__banner').length > 0) {
      // Cookie banner exists, accept it
      cy.get('#shopify-pc__banner__btn-accept').click();
      cy.get('#shopify-pc__banner').should('not.be.visible');
    } else {
      // Cookie banner doesn't exist, log and continue
      cy.log('Cookie banner not found - may already be accepted or not shown in this environment');
    }
  });
});

// Decline cookies (with resilient handling for CI environments)
Cypress.Commands.add('declineCookies', () => {
  // Check if the cookie banner exists first, then act accordingly
  cy.get('body').then($body => {
    if ($body.find('#shopify-pc__banner').length > 0) {
      // Cookie banner exists, decline it
      cy.get('#shopify-pc__banner__btn-decline').click();
      cy.get('#shopify-pc__banner').should('not.be.visible');
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