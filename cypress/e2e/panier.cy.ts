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
    cy.visit('/#/products/5');
    cy.get('[data-cy=detail-product-quantity]').clear().type('21');
    cy.get('[data-cy=detail-product-add]').click();
    checkCartIsEmpty();
  });

  it('ajoute un produit disponible au panier', () => {
    cy.visit('/#/products/5');

    // vérifie la présence du champ de disponibilité du produit
    cy.get('[data-cy=detail-product-stock]').should('exist');

    cy.get('[data-cy=detail-product-stock]').invoke('text').then((stockText) => {
      const initialStock = parseInt(stockText);
      cy.get('[data-cy=detail-product-name]').should('not.be.empty').invoke('text').then((productName) => {
        cy.get('[data-cy=detail-product-add]').click();
        cy.url().should('include', '/cart');
        cy.get('[data-cy=cart-line-name]').should('contain.text', productName);
        cy.get('[data-cy=cart-line-quantity]').should('have.value', '1');

        // vérifie via l'API que le produit a bien été ajouté au panier
        cy.request({
          method: 'GET',
          url: 'http://localhost:8081/orders',
          headers: { Authorization: 'Bearer ' + token }
        }).then((order) => {
          expect(order.body.orderLines.length).to.be.greaterThan(0);
        });

        // retourne sur la page produit et vérifie que le stock a diminué
        cy.visit('/#/products/5');
        cy.get('[data-cy=detail-product-stock]').invoke('text').then((newStockText) => {
          const newStock = parseInt(newStockText);
          expect(newStock).to.eq(initialStock - 1);
        });
      });
    });
  });
});