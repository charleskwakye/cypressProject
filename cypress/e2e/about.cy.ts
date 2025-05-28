describe('About Page', () => {
  beforeEach(() => {
    cy.loginWithStorePassword();
    // Accept cookies
    cy.acceptCookies();
    // Navigate to About page using the menu
    cy.get('#HeaderMenu-about-us > span').click({ force: true });
  });

  it('should display the correct title and content', () => {
    // Check that the page has the correct title
    cy.get('.main-page-title').should('contain.text', 'About');
    
    // Check for the exact full text content
    const expectedText = "From a small Antwerp grocery to a European coffee staple, RealBeans honors tradition while innovating for the future. Our beans are roasted in-house, shipped from Antwerp or Stockholm, and loved across the continent.";
    
    cy.get('.rte').invoke('text').then((text) => {
      // Normalize spaces and compare text
      const normalizedText = text.replace(/\s+/g, ' ').trim();
      expect(normalizedText).to.equal(expectedText);
    });
  });

}); 