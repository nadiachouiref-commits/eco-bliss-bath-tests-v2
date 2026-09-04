describe('Règles de gestion du stock', () => {
  beforeEach(() => {
    cy.loginByApi();
  });

  it('refuse de dépasser le stock disponible', () => {
    cy.intercept('PUT', '**/orders/add').as('addToCart');
    cy.visit('/#/products/5');
    cy.get('[data-cy=detail-product-name]').should('not.be.empty');
    cy.get('[data-cy=detail-product-quantity]').clear().type('999');
    cy.get('[data-cy=detail-product-add]').click();

    cy.wait('@addToCart');
    cy.url().should('not.include', '/cart');
  });

  it('refuse d\'ajouter un produit en rupture de stock', () => {
    cy.intercept('PUT', '**/orders/add').as('addToCart');
    cy.visit('/#/products/3');
    cy.get('[data-cy=detail-product-name]').should('not.be.empty');
    cy.get('[data-cy=detail-product-add]').click();

    cy.wait('@addToCart');
    cy.url().should('not.include', '/cart');
  });
});