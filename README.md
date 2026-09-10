# Eco Bliss Bath — Tests Cypress

Ce dépôt contient les tests d'acceptation automatisés (Cypress) du site **Eco Bliss Bath**.
Le code source du site (frontend Angular + backend Symfony) se trouve dans un dépôt séparé.

## Prérequis

- Node.js installé
- Le site (frontend et backend) doit être lancé en local avant d'exécuter les tests

## Installation

npm install

## Lancer le site avant les tests

Depuis le dépôt du site :

docker-compose up          # backend (Symfony) sur http://localhost:8081
cd frontend && npm start   # frontend (Angular) sur http://localhost:4200

## Compte de test

email : test2@test.fr
mot de passe : testtest

## Lancer les tests

npx cypress open   # interface graphique (mode développement)
npx cypress run    # mode terminal / headless (ex. intégration continue)

## Structure des tests

- `login.cy.ts` — connexion utilisateur
- `panier.cy.ts` — ajout au panier, gestion du stock (limites, rupture)
- `api.cy.ts` — tests API (backend)
- `smoke.cy.ts` — smoke tests
- `xss.cy.ts` — sécurité (injection XSS)
- `register.cy.ts` — création de compte