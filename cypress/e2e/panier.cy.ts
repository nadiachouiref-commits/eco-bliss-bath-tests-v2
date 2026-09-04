describe('Panier', () => {
  beforeEach(() => {
    cy.loginByApi().then((token) => {
      // vider le panier existant
      cy.request({
        method: 'GET',
        url: 'http://localhost:8081/orders',
        headers: { Authorization: 'Bearer ' + token }
      }).then((order) => {
        order.body.orderLines.forEach((line) => {
          cy.request({
            method: 'DELETE',
            url: `http://localhost:8081/orders/${line.id}/delete`,
            headers: { Authorization: 'Bearer ' + token }
          });
        });
      });
    });
  });
  it('ajoute un produit au panier', () => {
    cy.visit('/#/products/5');
    cy.get('[data-cy=detail-product-name]').should('not.be.empty').invoke('text').then((productName) => {
      cy.get('[data-cy=detail-product-add]').click();
      cy.url().should('include', '/cart');
      cy.get('[data-cy=cart-line-name]').should('contain.text', productName);
      cy.get('[data-cy=cart-line-quantity]').should('have.value', '1');
    });
  });
});