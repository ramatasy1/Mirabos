# Logiciel d’administration

Ce projet est un logiciel d’administration destiné à gérer les besoins essentiels d’une entreprise, en commençant par un module complet de **facturation**.  
L’objectif est de permettre à une entreprise de créer ses documents administratifs (factures, devis, clients, produits, etc.) et de faire évoluer progressivement l’outil vers une solution complète de gestion administrative.

## Objectifs

- Centraliser les informations administratives d’une entreprise
- Permettre la création rapide et automatique de factures professionnelles
- Simplifier la gestion des clients et des produits/services
- Offrir une base solide pour des fonctionnalités futures (devis, bons de commande, statistiques, gestion des utilisateurs, etc.)
- Construire un logiciel évolutif, modulaire et facile à maintenir

## Fonctionnalités prévues (Phase 1 : Facturation)

- Création de factures professionnelles
- Génération automatique des numéros de facture
- Ajout des informations de l’entreprise (logo, adresse, SIRET, TVA…)
- Gestion des clients (ajout, modification, suppression)
- Gestion des produits/services (prix, description, TVA)
- Calcul automatique :
  - Total HT
  - TVA
  - Total TTC
- Export PDF (prévu pour la phase backend)
- Historique des factures
- Statut des factures (payée, en attente, en retard)

## Fonctionnalités futures (Évolution administrative)

- Gestion des devis
- Gestion des bons de commande / bons de livraison
- Gestion documentaire (dossiers, fichiers)
- Tableau de bord avancé (statistiques, graphiques)
- Gestion des utilisateurs et des rôles
- Paramètres avancés du système
- Archivage et export comptable

## Structure du projet

```text
logiciel-administration/
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── js/
│   └── modules/
│       ├── facturation/
│       ├── clients/
│       ├── produits/
│       └── systeme/
├── docs/
│   ├── README.md
│   ├── roadmap.md
│   └── modele-donnees.md
└── .gitignore
