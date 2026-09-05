# Eco Bliss Bath — Tests Cypress

Ce dépôt contient les tests d'acceptation automatisés (Cypress) du site **Eco Bliss Bath**.
Le code source du site (frontend Angular + backend Symfony) se trouve dans un dépôt séparé.

## Prérequis

- Node.js installé
- Le site (frontend et backend) doit être lancé en local avant d'exécuter les tests

## Installation

```bash
npm install
```

## Lancer le site avant les tests

Depuis le dépôt du site :

```bash
docker-compose up          # backend (Symfony) sur http://localhost:8081
cd frontend && npm start   # frontend (Angular) sur http://localhost:4200
```

## Lancer les tests

```bash
npx cypress open   # interface graphique (mode développement)
npx cypress run    # mode terminal / headless (ex. intégration continue)
```

## Structure des tests

- `login.cy.ts` — connexion utilisateur
- `panier.cy.ts` — ajout au panier
- `api.cy.ts` — tests API (backend)
- `smoke.cy.ts` — smoke tests
- `xss.cy.ts` — sécurité (injection XSS)
- `inscription.cy.ts` — création de compte
- `stock.cy.ts` — règles de gestion du stock