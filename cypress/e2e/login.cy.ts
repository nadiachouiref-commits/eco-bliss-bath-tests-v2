describe('Connexion', () => {
  it('connecte un utilisateur avec des identifiants valides', () => {
    cy.visit('/#/login');

    cy.get('[data-cy=login-input-username]').type('test2@test.fr');
    cy.get('[data-cy=login-input-password]').type('testtest');
    cy.get('[data-cy=login-submit]').click();

    cy.url().should('not.include', '/login');
  });

  it('refuse une connexion avec un mauvais mot de passe', () => {
    cy.visit('/#/login');
    cy.get('[data-cy=login-input-username]').type('test2@test.fr');
    cy.get('[data-cy=login-input-password]').type('mauvaismotdepasse');
    cy.get('[data-cy=login-submit]').click();

    cy.get('[data-cy=login-errors]').should('be.visible');
    cy.url().should('include', '/login');
  });
});