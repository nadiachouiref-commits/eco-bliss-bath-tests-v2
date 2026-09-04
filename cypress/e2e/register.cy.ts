describe('Inscription', () => {
  it('crée un nouveau compte', () => {
    cy.visit('/#/register');

    const email = 'test' + Date.now() + '@test.fr';

    cy.get('[data-cy=register-input-lastname]').type('Dupont');
    cy.get('[data-cy=register-input-firstname]').type('Jean');
    cy.get('[data-cy=register-input-email]').type(email);
    cy.get('[data-cy=register-input-password]').type('MotDePasse123');
    cy.get('[data-cy=register-input-password-confirm]').type('MotDePasse123');

    cy.get('[data-cy=register-submit]').click();

    cy.url().should('not.include', '/register');
  });
});