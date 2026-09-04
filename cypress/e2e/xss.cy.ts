describe('Sécurité - XSS', () => {
  let token;

  before(() => {
    cy.loginByApi().then((t) => {
      token = t;
    });
  });

  it('empêche l\'exécution d\'un script dans un avis', () => {
    cy.visit('/#/reviews');
    cy.get('[data-cy=review-input-title]').type('Test');
    cy.get('[data-cy=review-input-comment]').type('<img src=x onerror="window.xssTriggered=true">');
    cy.get('[data-cy=review-submit]').click();

    cy.window().its('xssTriggered').should('be.undefined');
  });

  it('empêche l\'injection de script via la route d\'ajout au panier', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/orders/add',
      headers: { Authorization: 'Bearer ' + token },
      body: { product: '<img src=x onerror="window.xssTriggered=true">', quantity: 1 },
      failOnStatusCode: false
    }).then((response) => {
      cy.log('status: ' + response.status);
      expect(response.status).to.not.eq(200);
    });
  });
});