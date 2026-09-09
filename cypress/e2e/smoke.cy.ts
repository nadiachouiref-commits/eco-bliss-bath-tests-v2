describe('Smoke tests', () => {
  it('affiche les champs et le bouton de connexion', () => {
    cy.visit('/#/login');
    cy.get('[data-cy=login-input-username]').should('exist');
    cy.get('[data-cy=login-input-password]').should('exist');
    cy.get('[data-cy=login-submit]').should('exist');
  });

  it('affiche le bouton d\'ajout au panier et la disponibilité du produit', () => {
    cy.visit('/#/products/5');
    cy.get('[data-cy=detail-product-add]').should('exist');
  });
});