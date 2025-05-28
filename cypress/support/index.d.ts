/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to login with the store password
     * @example cy.loginWithStorePassword()
     */
    loginWithStorePassword(): Chainable<void>;

    /**
     * Custom command to attempt login with incorrect password
     * @example cy.attemptIncorrectPasswordLogin('wrongpass')
     */
    attemptIncorrectPasswordLogin(incorrectPassword?: string): Chainable<void>;

    /**
     * Custom command to verify the cookie banner is visible
     * @example cy.verifyCookieBannerVisible()
     */
    verifyCookieBannerVisible(): Chainable<void>;

    /**
     * Custom command to accept cookies
     * @example cy.acceptCookies()
     */
    acceptCookies(): Chainable<void>;

    /**
     * Custom command to decline cookies
     * @example cy.declineCookies()
     */
    declineCookies(): Chainable<void>;

    /**
     * Custom command to navigate to catalog page
     * @example cy.navigateToCatalog()
     */
    navigateToCatalog(): Chainable<void>;

    /**
     * Custom command to navigate to about page
     * @example cy.navigateToAbout()
     */
    navigateToAbout(): Chainable<void>;
  }
} 