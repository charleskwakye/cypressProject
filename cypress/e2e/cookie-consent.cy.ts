describe('Cookie Consent Banner', () => {
  beforeEach(() => {
    cy.loginWithStorePassword();
    cy.verifyCookieBannerVisible();
  });

  it('should allow user to accept cookies', () => {
    cy.acceptCookies();
  });

  it('should allow user to decline cookies', () => {
    cy.declineCookies();
  });
}); 