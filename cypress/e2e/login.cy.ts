describe('Login Functionality', () => {
  

  it('should display error message with incorrect password', () => {
    cy.attemptIncorrectPasswordLogin();
  });

  it('should login successfully with correct password', () => {
    cy.loginWithStorePassword();
    // Accept cookies
    cy.acceptCookies();
  });
}); 