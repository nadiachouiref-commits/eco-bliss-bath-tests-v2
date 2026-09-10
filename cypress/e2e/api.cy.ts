describe('Tests API', () => {
  let token;

  before(() => {
    cy.loginByApi().then((t) => {
      token = t;
    });
  });

  it('GET /orders sans connexion renvoie 401', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/orders',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('GET /orders avec connexion renvoie la liste du panier', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/orders',
      headers: { Authorization: 'Bearer ' + token }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('orderLines');
    });
  });

  it('GET /products/{id} renvoie la fiche du produit', () => {
    cy.request('http://localhost:8081/products/5').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('name');
    });
  });

  it('POST ajoute un produit disponible au panier', () => {
    cy.request({
      method: 'PUT', // note : le code utilise PUT au lieu de POST (anomalie déjà connue)
      url: 'http://localhost:8081/orders/add',
      headers: { Authorization: 'Bearer ' + token },
      body: { product: 5, quantity: 1 }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('POST ajoute un produit en rupture de stock', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/orders/add',
      headers: { Authorization: 'Bearer ' + token },
      body: { product: 3, quantity: 1 },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.not.eq(200); // attendu : refusé
    });
  });
});