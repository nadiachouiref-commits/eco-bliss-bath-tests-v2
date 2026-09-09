describe('Connexion', () => {
  it('connecte un utilisateur avec des identifiants valides', () => {
    cy.visit('/#/login');

    cy.get('[data-cy=login-input-username]').type('test2@test.fr');
    cy.get('[data-cy=login-input-password]').type('testtest');
    cy.get('[data-cy=login-submit]').click();

    // vérifie que les liens "Mon panier" et "Déconnexion" sont visibles
    cy.get('[data-cy=nav-link-cart]').should('be.visible');
    cy.get('[data-cy=nav-link-logout]').should('be.visible');
  });

  it('refuse une connexion avec un mauvais mot de passe', () => {
    cy.visit('/#/login');
    cy.get('[data-cy=login-input-username]').type('test2@test.fr');
    cy.get('[data-cy=login-input-password]').type('mauvaismotdepasse');
    cy.get('[data-cy=login-submit]').click();

    cy.get('[data-cy=login-errors]').should('be.visible');

    // vérifie qu'on n'est pas connectée malgré l'erreur
    cy.get('[data-cy=nav-link-login]').should('be.visible');
    cy.get('[data-cy=nav-link-register]').should('be.visible');
  });
});