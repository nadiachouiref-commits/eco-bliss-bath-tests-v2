describe('Panier', () => {
  let token;

  // vide le panier avant chaque test pour partir d'un état propre
  beforeEach(() => {
    cy.loginByApi().then((t) => {
      token = t;
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

  // fonction pour vérifie via l'API que le panier est vide
  const checkCartIsEmpty = () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/orders',
      headers: { Authorization: 'Bearer ' + token }
    }).then((order) => {
      expect(order.body.orderLines.length).to.eq(0);
    });
  };

  it('refuse d\'ajouter un produit en rupture de stock', () => {
    cy.intercept('PUT', '**/orders/add').as('addToCart');
    cy.visit('/#/products/3');
    cy.get('[data-cy=detail-product-name]').should('not.be.empty');
    cy.get('[data-cy=detail-product-add]').click();
    cy.wait('@addToCart');
    checkCartIsEmpty();
  });

  it('refuse une quantité négative', () => {
    cy.visit('/#/products/5');
    cy.get('[data-cy=detail-product-quantity]').clear().type('-1');
    cy.get('[data-cy=detail-product-add]').click();
    checkCartIsEmpty();
  });

  it('refuse une quantité supérieure à 20', () => {
    cy.intercept('PUT', '**/orders/add').as('addToCart');
    cy.visit('/#/products/7');
    cy.get('[data-cy=detail-product-name]').should('not.be.empty');
    cy.get('[data-cy=detail-product-quantity]').clear().type('21');
    cy.get('[data-cy=detail-product-add]').click();
    cy.wait('@addToCart');
    checkCartIsEmpty();
  });

  it('ajoute un produit disponible au panier', () => {
    cy.intercept('GET', '**/products/5').as('getProduct');
    cy.visit('/#/products/5');
    cy.wait('@getProduct');

    cy.get('[data-cy=detail-product-stock]').should('exist');

    cy.get('[data-cy=detail-product-stock]').should('not.be.empty').invoke('text').then((stockText) => {
      const initialStock = parseInt(stockText.replace(/\D/g, ''));
      cy.get('[data-cy=detail-product-name]').should('not.be.empty').invoke('text').then((productName) => {
        cy.get('[data-cy=detail-product-add]').click();
        cy.url().should('include', '/cart');
        cy.get('[data-cy=cart-line-name]').should('contain.text', productName);
        cy.get('[data-cy=cart-line-quantity]').should('have.value', '1');

        cy.request({
          method: 'GET',
          url: 'http://localhost:8081/orders',
          headers: { Authorization: 'Bearer ' + token }
        }).then((order) => {
          expect(order.body.orderLines.length).to.be.greaterThan(0);
        });

        cy.intercept('GET', '**/products/5').as('getProductAgain');
        cy.visit('/#/products/5');
        cy.wait('@getProductAgain');
        cy.get('[data-cy=detail-product-stock]').should('not.be.empty').invoke('text').then((newStockText) => {
          const newStock = parseInt(newStockText.replace(/\D/g, ''));
          expect(newStock).to.eq(initialStock - 1);
        });
      });
    });
  });
});